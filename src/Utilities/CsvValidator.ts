export type validationErrors = {
    row: number;
    column: string;
    message: string;
}
type CSVData = {
    [key:string]:string;
}

const validateRow = (row:CSVData, rowIndex:number ) => {
   const rowErrors: validationErrors[] = [];

   if (!row["First Name"] || row["First Name"].trim() === '') {
    rowErrors.push({
        row: rowIndex+1,
        column: "First Name",
        message: "First Name is required"
    })};

    if (!row["Email"] || !/^\S+@\S+\.\S+$/.test(row["Email"])) 
      rowErrors.push({
          row: rowIndex+1,
          column: "Email",
          message: "Invalid Email"
      });

    if (!row["Phone Number"] || isNaN(Number(row["Phone Number"])) || !/^\d{10}$/.test(row["Phone Number"])) {
        rowErrors.push({
          row: rowIndex+1,
          column: "Phone Number",
          message: "Invalid Phone Number"
      })};

    if (!row["Last Name"] || row["Last Name"].trim() === '') {
      rowErrors.push({
          row: rowIndex+1,
          column: "Last Name",
          message: "Last Name is required"
      })};

      return rowErrors;
  
}

const validateCsv = (data: CSVData[]): validationErrors[] => {
    const csvErrors:validationErrors[] = [];
    console.log(data)
    data.forEach((row, index)=> {
        csvErrors.push(...validateRow(row,index));
    });
    return csvErrors;
};

export default validateCsv;
