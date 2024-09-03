import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import xl from "excel4node";

const filePath = "./amazon.txt";
const excelSheetFilePath = "amazon.xlsx";

const wb = new xl.Workbook();
const ws = wb.addWorksheet("Mobile Data");

const writeExcelData = (arr, row, col) => {
  arr.forEach((item) => {
    ws.cell(row, col++).string(item || "N/A");
  });
  wb.write(excelSheetFilePath);
};

async function amazonScrapping() {
  try {
    const mobileInformation = [];
    const data = fs.readFileSync(filePath, "utf8");

    const $ = cheerio.load(data);
    $(".a-price-whole").each((index, tag) => {
      // console.log(tag);
      mobileInformation[index] = {};
      mobileInformation[index].price = $(tag).text();
      // console.log($(tag).text());
    });
    $(".a-size-medium.a-color-base.a-text-normal").each((index, tag) => {
      mobileInformation[index].name = $(tag).text();
      // console.log($(tag).text());
    });
    $(".reviews-ratings-slot").each((index, tag) => {
        mobileInformation[index].ratings = $(tag).text();
        // console.log($(tag).text());
      });

    
    let row = 1;
    console.log(mobileInformation);
    writeExcelData(["Name", "Price", "Ratings"], 1, 1);
    mobileInformation.forEach((record) =>
      writeExcelData([record.name, record.price, record.ratings], ++row, 1)
    );
  } catch (error) {
    console.log(error);
  }
}
amazonScrapping();

// Function to write data to a file
function writeFile(filePath, data) {
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.error("Error writing to file", err);
    } else {
      console.log("File written successfully");
    }
  });
}

function readFile(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file", err);
    } else {
      console.log("File content:", data);
    }
  });
}
