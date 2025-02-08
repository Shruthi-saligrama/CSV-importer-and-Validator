import React, { useState } from "react";
import { validationErrors } from "../Utilities/CsvValidator";
import axios from 'axios';

type DataListProps = {
  headers: string [];
  CSVdata: { [key: string]: string }[];
  csvErrors: validationErrors[];
  onUpdate: (rowIndex: number, column:string, newValue:string) => void;
  onSubmit: (data: { [key: string]: string} []) => void;
}

const DataList : React.FC<DataListProps> = ({headers, CSVdata, csvErrors, onUpdate}) => {
  const [editCell, setEditCell] = useState<{rowIndex: number; column: string} | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const errorMap = csvErrors.reduce<{ [key:string]: string}>((acc, error) => {
    const key = `${error.row}-${error.column}`;
    acc[key] = error.message;
    return acc;
  }, {});

  const handleDataSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionStatus(null);
    try {
      const response = await axios.post("http://localhost:5000/csvData", CSVdata, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      setSubmissionStatus("Success! Data submitted successfully");
      console.log(response.data);
      } catch (error) {
        console.error(error);
        setSubmissionStatus("Error submitting data");
      } finally {
        setIsSubmitting(false);
    }
  }

  const handleCellClick = (rowIndex:number, column:string, currentValue:string) => {
      setEditCell({rowIndex, column});
      setEditValue(currentValue);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value)
  }
  
  const handleInputBlur = () => {
    if(editCell) {
      onUpdate(editCell.rowIndex, editCell.column, editValue);
      setEditCell(null);
    }
  }

  const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editCell) {
      console.log(e.key)
      onUpdate(editCell.rowIndex, editCell.column, editValue);
      setEditCell(null);
    }
  }

    return(
    <>
      <h2 className="mb-3">CSV Data Preview</h2>
      <h6 className="mb-3"> Review Validation Errors and fix your Data </h6>
      <div className="table-wrapper position-relative">  
        <h4><span className= {`badge position-absolute badge-top-right ${csvErrors.length > 0 ? "bg-danger" : "bg-warning" }`}> 
            {csvErrors.length} Errors
        </span></h4>
        <div className="table-scrollable">
          <table className="table table-bordered excel-table">
            <thead className="sticky-header">
              <tr>
                { headers.map((header, index) => (
                  <th key={index} className="excel-header">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CSVdata.map((row , rowIndex) => (
                <tr key={rowIndex}>
                    { headers.map((header, colIndex) => {
                      const cellKey = `${rowIndex+1}-${header}`;
                      const cellError = errorMap[cellKey];
                      const isEditing = editCell?.rowIndex === rowIndex && editCell.column === header;
                      return ( 
                        <td
                        key={colIndex}
                        className={`excel-cell ${
                          cellError ? "excel-cell-error" : ""
                        }`}
                        data-bs-toggle={cellError ? "tooltip" : ""}
                        data-bs-placement="top"
                        title={cellError || ""}
                        style={{cursor: cellError ? "pointer" : "default", position: "relative",}}
                        onClick={() =>
                          cellError &&
                          handleCellClick(rowIndex, header, row[header] || "")
                        }
                      >
                      {isEditing ? (
                        <input type="text" value = {editValue} onChange={handleInputChange} onBlur={handleInputBlur} onKeyDown={handleKeyDown} autoFocus className="form-control excel-input" /> 
                      ) : (row[header] || "")}
                        
                      </td>
                      )
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        <div className="mt-3 float-right">
          <button className={`btn ${csvErrors.length === 0 ? "btn-primary" : "btn-secondary"}`} disabled= {isSubmitting||csvErrors.length> 0} onClick={handleDataSubmit}>
            { isSubmitting ? "Submitting" : "Submit Data"} 
          </button>
          {submissionStatus && (
            <p className={ `mt-2 ${submissionStatus.includes("Error") ? "text-danger" : "text-success"}`}>
              {submissionStatus}
              </p>
          )}
        </div>
    </>
    )
}

export default DataList;