var ipp = require("ipp");
var fs = require("fs");
var PDFDocument = require("pdfkit");
var concat = require("concat-stream");

// var printer = ipp.Printer("http://10.147.20.1:631/printers/HP1106");
var printer = ipp.Printer("http://localhost:631/printers/HP1106");

var doc = new PDFDocument({ margin: 0 });
doc.text(".", 0, 0);

// doc.pipe(
//   concat(function (data) {
//     var msg = {
//       "operation-attributes-tag": {
//         "job-name": "whatever223.pdf",
//         "document-format": "application/pdf",
//       },
//       "job-attributes-tag": {
// 				copies: 2,
//         // "page-ranges": "1-1"
//       },
//       data: data,
//     };
//     printer.execute("Print-Job", msg, function (err, res) {
//       console.log(err);
//       console.log(res);
//     });
//   }),
// );
// doc.end();

// var msg = {
//   "operation-attributes-tag": {
//     "requesting-user-name": "William",
//     "job-name": "My Test Job",
//     "document-format": "application/pdf",
//   },
//   data: pdf,
// };
// printer.execute("Print-Job", msg, function (err, res) {
//   console.log(res);
// });

// Get-Job-Attributes
// printer.execute("Get-Job-Attributes", {
// 	"operation-attributes-tag": {
// 		'job-uri': 'ipp://localhost:631/jobs/14'
// 	}
// }, function(err, res){
// 		console.log(res);
// 	});

// Get-Jobs
// done
// printer.execute("Get-Jobs", {
//   "operation-attributes-tag": {
//     "requested-attributes": [
//       "job-id",
//       "job-uri",
//       "job-state",
//       "job-state-reasons",
//       "job-name",
//       "job-originating-user-name",
//       "job-media-sheets-completed"
//     ]
//   }
// }, function(err, res){
//   if (err) return console.log(err);
//   console.log(res['job-attributes-tag']);
// });

// 查看 printer 状态
// done
// printer.execute(
//   "Get-Printer-Attributes",
//   {
//     "operation-attributes-tag": {
//       "requested-attributes": [
//         "queued-job-count",
//         "marker-levels",
//         "printer-state",
//         "printer-state-reasons",
//         "printer-state-message",
//         "printer-up-time",
//       ],
//     },
//   },
//   function (err, res) {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log("xxxx", res);
//   },
// );

// 取消 JOB
// done
// printer.execute(
//   "Cancel-Job",
//   {
//     "operation-attributes-tag": {
//       "requesting-user-name": "print",
//       "job-id": "2",
//     },
//   },
//   function (err, res) {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log("xxxx", res);
//   },
// );
