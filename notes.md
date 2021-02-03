Destroy Database: 'node seeder -d'
Insert Dummy Data into Database: 'node seeder -i'

Queries {{URL}}/api/v1/bootcamps?select=name,description,averageSalary&sort=-averageSalary
pagination : {{URL}}/api/v1/bootcamps?page=4

Enum - Where there is an enum, it means the field can only contain what is in the enum array

The courses route includes one to get courses by bootcampId. For this to work you need to include 'mergeParams' within the router in courses routes file

mongoose.virtuals to add courses to bootcamp list

express-mongo-sanitize is used to prevent NoSQL injection attacks

Helmet - Adds header values to make the API more secure - More info at helmetjs.github.io
XSS Clean - Prevents html / js tags being included in the naming of the fields in the database
