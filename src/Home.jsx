import React, { useEffect, useState } from "react";
import "./Home.css";
import { CSVReader, CSVDownloader, jsonToCSV } from "react-papaparse";
import { FcFullTrash, FcDownload } from "react-icons/fc";
import axios from "axios";

const Home = () => {
  const [filename, setFilename] = useState("");
  const [filedata, setFiledata] = useState([]);
  const [resfiledata, setResfiledata] = useState([]);
  const [resfilename, setResfilename] = useState("");
  const [resallfiledata, setResallfiledata] = useState([]);
  const [resallfilename, setResallfilename] = useState("");

  const handleOnDrop = (data, file) => {
    data.map((value) => {
      setFiledata((filedata) => [...filedata, value.data]);
    });

    setFilename(file.name);
  };
  const handleOnError = (err, file, inputElem, reason) => {};
  const handleOnRemoveFile = (data) => {
    setFilename("");
  };

  const upload = () => {
    const ojbfiledata = JSON.stringify(filedata);
    axios
      .post("http://localhost:5000/uploadcsv", {
        FILENAME: filename,
        FILEDATA: ojbfiledata,
      })
      .then((e) => {
        console.log(e.data);
      });
          getalldata();
         
  };

  //GET one data

  const getdata = () => {
    axios.get("http://localhost:5000/downloadcsv/1").then((e) => {
      // console.log(e.data);
      setResfilename(e.data[0].FILENAME);
      setResfiledata(e.data[0].FILEDATA);

      console.log(e);
    });
  };

  // get all data

  const getalldata = () => {
    axios.get("http://localhost:5000/downloadcsv").then((e) => {
      setResallfilename(e.data[0].FILENAME);
      setResallfiledata(e.data);
    });
  };

    const deletefile = async (id) => {
      await axios.delete(`http://localhost:5000/deletecsv/${id}`);
       getalldata();
    };


  useEffect(() => {
    getalldata();
  }, []);


  resallfiledata.map((e)=>{console.log(e);})
  // console.log(resallfiledata);

  return (
    <>
      <div className="container">
        <div className="input">
          <h3>File Name</h3>
          <input type="text" value={filename} onChange={"noChange"} />
          <div className="csv">
            <CSVReader
              onDrop={handleOnDrop}
              onError={handleOnError}
              onRemoveFile={handleOnRemoveFile}
              addRemoveButton
              config={{ header: true, dynamicTyping: true }}
            >
              <span>Drop CSV file here or click to import.</span>
            </CSVReader>
            <button onClick={upload}>upload</button>
          </div>
        </div>

        <div className="siderbar">
          <h3> Your recent file</h3>
          <table class="table">
            <tbody>
              {resallfiledata.map((value,i)=>{
                    return (
                      <tr>
                        <th scope="row">{i + 1}</th>
                        <td>{value.FILENAME}</td>

                        <td>
                          <CSVDownloader
                            filename={value.FILENAME}
                            data={value.FILEDATA}
                            bom={true}
                            download={true}
                          >
                            <button>
                             Download
                            </button>
                          </CSVDownloader>
                        </td>
                        <td>
                          <button
                            style={{ color: "red" }}
                            onClick={() => deletefile(value.FILEID)}
                          >
                           delete
                          </button>
                        </td>
                      </tr>
                    ); 
              })}
             

            </tbody>
          </table>
          <div>
            <div>
              {/*      
                  <div className="filename">
                    <p>{filename}</p>
                  </div>

                  <div className="icon">
                    <span>
                      <FcFullTrash />
                    </span>
                    <span>
                      <CSVDownloader
                        filename={resfilename}
                        data={resfiledata}
                        bom={true}
                        download={true}
                      >
                        <button>
                          <FcDownload />
                        </button>
                      </CSVDownloader>
                    </span>
                  </div> */}
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
