import CsvFileInput from "./CsvFileInput";

const Home: React.FC = () => {

return (
  <>
  <div className="container mt-4">
    <h1 className="mb-4">CSV importer and Validator</h1>
    <hr className="border border-primary border-2 opacity-75"></hr>
    <CsvFileInput />
  </div>
  <footer className="footer p-4 container">
      <hr></hr>
      <div className="bg-body-tertiary text-lg-center p-2">
        <p>&copy; 2025 Your Website. All rights reserved.</p>
    </div>
  </footer>
  </>
)
}

export default Home;