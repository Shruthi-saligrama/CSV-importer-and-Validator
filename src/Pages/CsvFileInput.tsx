import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import DataList from "./DataList";
import validateCsv, { validationErrors } from "../Utilities/CsvValidator";

const CsvFileInput: React.FC = () => {
    const [csvdata, setCsvData] = useState<CSVData[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [fileUploadError, setFileUploadError] = useState<string|null>('');
    const [csvErrors, SetCsvErrors] = useState<validationErrors[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> ) => {
        const file = e.target.files?.[0];

        if(!file) {
            setFileUploadError('No file uploaded');
            return;
        }
        else {
          setIsUploading(true);
            Papa.parse(file, {
                complete: (results) => {
                  setTimeout(() => { 
                    if(results.errors.length) {
                      setFileUploadError('Error: parsing Csv file');
                     } else {
                      const parsedData = results.data as CSVData[];
                      const validationErrors = validateCsv(parsedData); 
  
                      setCsvData(parsedData);
                      setHeaders(parsedData.length > 0 ? Object.keys(parsedData[0]) : [])
                      SetCsvErrors(validationErrors);
                      setFileUploadError(null)
                     } 
                     setIsUploading(false); 
                  }, 2000);
                },
                header: true,
                dynamicTyping: true,
                skipEmptyLines:true,
                error: (err) => {
                  setFileUploadError(err.message);
                  setIsUploading(false);
                }
            })
        }

    }

    const handleUpdate = (rowIndex: number, column: string, newValue:string) => {
        const updatedCsvData = [...csvdata]
        updatedCsvData[rowIndex][column] = newValue;
        setCsvData(updatedCsvData);

        const validationErrors = validateCsv(updatedCsvData);
        SetCsvErrors(validationErrors)
    }

    const handleDataSubmit = (submittedData: {[key: string]: string} []) => {
        console.log("Submitted Data: ", submittedData)
    }

    useEffect(() => {
        const tooltipTriggerList = [].slice.call(
          document.querySelectorAll('[data-bs-toggle="tooltip"]')
        );
        tooltipTriggerList.forEach((tooltipTriggerEl) => {
          new window.bootstrap.Tooltip(tooltipTriggerEl);
        });
      }, []);

    return (
        <>
        <div className="input-group mb-3 w-50 p-3 bs-success-border-subtle">
            <input type="file" className="form-control" accept=" .csv" onChange={handleFileUpload} />
        </div>
        {fileUploadError && <div className="alert alert-danger mt-3">{fileUploadError}</div>}
        { csvdata.length > 0 && <DataList headers={headers} CSVdata={csvdata} csvErrors= {csvErrors} onUpdate = {handleUpdate} onSubmit={handleDataSubmit}/> }
        {isUploading && (
          <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Processing CSV file...</p>
                </div>
              </div>
            </div>
          </div>
        )}
        </>
    )
}

type CSVData = {
    [key: string]: string
}

export default CsvFileInput;
