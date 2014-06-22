learnNodejs
===========

Node Js Exercises

Objective of the exercise:
Activity 1. Scan a directory for feed files and process them individually. Weed out the duplicates based on fname, lname combination. Once the data is processed POST the data to a rest service.
Activity 2. Scan a directory for feed files and process the data completely. Weed out the duplicates based on fname, lname combination on the entire dataset. Once the data is processed POST the data to a rest service.

The version of Node.js used - v0.10.29
Platform - Windows

There is a simple HttpServer given which will respond back with the data posted. This does not handle any request routing or other functionalities offered as in any other HttpServer and is just created for testing these activities.

Start the HttpServer

node HttpServer

To run activity 1

- Start the HttpServer
- node main.js <Directory Containing the feed files> <delimiter> <feed file extn>

To run activity 2
- Start the HttpServer
- node cmain.js <Directory Containing the feed files> <delimiter> <feed file extn>


Following are the files created to acheive the functionality

FileReader.js
This class will read a file and emit event for every line of the file. This will read a block of file based on the required buffer size and will split at new line ('\n'). When there are partial lines read into the buffer complete lines are emitted as 'lines' event. Partial line is added to the next read and handled. For convenience 'line' event is emitted which will emit each line. Client can use any of these as per their requirement. 'eof' is emitted when the file reaches its end.  fs.readLine is not used to read the file line by line because it skips the last line if it is not terminated by a new line character.

Events Listened
this.linesOccur, this is listened to emit each line event

Events Emitted 	
'linesOccur', this is emitted along with an array of lines read equivalent to the passed buffer size
'line', this is emitted for each line along with the line content

FeedFileProcessor.js
Purpose of this js is to process a feed file. It uses the FileReader.js to read the file. It listens for 'line' event emiited by FileReader and handles the line. It converts it to a json object and stores it in a List. Duplicates are identified using fname, lname combination. A List is maintained for this combination to avoid iterating the List again and again for duplicate check. Have to figure out if an equivalent of equals method is available in Javascript. FileReader.eof is Listened to trigger the event 'completedProcess'

Events Listened 	
FileReader.line, FileReader.eof
 
Events Emitted
'completedProcess'. This denotes the processing of the file has been completed
'invalidFeedItem'. This is emitted when the number of parts or fname or lname is not found


CumulativeFeedFileProcessor.js
This is a sub class of FeedFileProcessor to handle if the requirement is to process all the files and remove duplicates before making the RESTful service call. This is used for activity 2.

RestClient.js
This is a helper class for making REST API calls. Supports POST and GET method. Responsibility of handling Callbacks to handle response are with the caller of this class.

List.js
This is a helper class around an array, with methods to add element, check existence of an element, etc.

HttpServer.js
A simple http server that will respond back with the same requested data as response. This is only for testing the feed files handling and there are no routers or other functionality

main.js
The wrapper script to perform the functionality of scanning a directory for feed files and processing it. This script will POST the data once each file is processed. To process all the files together to eliminate duplicated across the files before making the POST refer cmain.js.


cmain.js
The wrapper script to perform the functionality of scanning a directory for feed files and processing them together. This script will POST the data after all the files are processed. To process files individually to eliminate duplicated items and making the POST refer main.js.