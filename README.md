# IT System Plan

**Ferenc Molnar** 

---

## Content

1. [Architecture](#architecture)  
   1.1 [Overview](#overview)  
   1.2 [Layers and Responsibilities](#layers-and-responsibilities)  
   1.3 [Desktop Application](#desktop-application)  
   1.4 [Web App](#web-app)  
   1.5 [External Libraries](#external-libraries)  
   1.6 [Dependencies](#dependencies)  
      1.6.1 [Minimum Hardware Requirements](#minimum-hardware-requirements)  
      1.6.2 [Recommended Hardware Requirements](#recommended-hardware-requirements)  
      1.6.3 [Desktop App](#desktop-app)  
      1.6.4 [Web App](#web-app-1)  
2. [Modules](#modules)  
   2.1 [Overview](#overview-1)  
3. [Persistence](#persistence)  
   3.1 [Selected Storage Method](#the-chosen-method-of-storage)  
   3.2 [Conceptual Data Model](#conceptual-data-model)  
4. [Processes](#processes)  
5. [User Documentation](#user-documentation)  
   5.1 [General Visitors](#general-visitor)  
      5.1.1 [Home Page](#home-page)  
      5.1.2 [Navigation Bar](#navigation-bar)  
      5.1.3 [Footer](#footer)  
      5.1.4 [All](#all)  
      5.1.5 [Car Data Sheet](#car-data-sheet)  
      5.1.6 [Search](#search)  
      5.1.7 [Login](#login)  
      5.1.8 [Forgotten Password](#forgot-password)  
      5.1.9 [Registration](#registration)  
      5.1.10 [Favorites](#favorites)  
      5.1.11 [My Data](#my-details)  
      5.1.12 [Modify Data](#change-data)  
      5.1.13 [Logout](#logout)  
   5.2 [Administrator](#administrator)  
      5.2.1 [User Accounts](#user-accounts)  
6. [Sources](#resources)  
   6.1 [Database](#database)  
   6.2 [Concepts](#concepts)  
   6.3 [Images](#pictures)  
   6.4 [Program Details](#program-details)  

---

## Architecture

### Overview

- **Desktop application**
- **WEB server**
- **Operating environment**: Windows environment
- **Windows .NET app**: A framework created by Microsoft that serves rapid application development.
- **Application server**: **NodeJS** v16.17.1: A software system for creating web servers.
- **MySQL** database server 8.0.31: Used for database management.
- **Connector /NET** 8.0.28
- **Supported browsers**: Chrome, Firefox, Brave
- **Usage protocols**: HTTP, HTTPS
- **Ports**:
  - MySQL: 3306
  - HTTP: 80 (Currently, the web client works with HTTPS protocol)
  - HTTPS: **443**
- **SSL certificate**:
  - Used for testing: Self-signed certificate generated with OpenSSL.
  - For the transferred version, we recommend purchasing the certificate for the domain used (e.g., carmarket.hu) from a certificate server.
  - Certificate storage folder location:
    - `[installation folder]\cert\localhost\`
    - `[installation folder]\bin\www.js` contains the availability of the certificate used.

```javascript
const options = {
  key: fs.readFileSync(path.join(__dirname, '../cert/localhost/localhost.decrypted.key')),
  cert: fs.readFileSync(path.join(__dirname, '../cert/localhost/localhost.crt'))
}
```

![Figure 1](media/image1.png)

### Layers and Responsibilities

**Router Layer:**

The Router Layer contains the application programming interface (API) routes. Its job is to call the appropriate method on the application server and wait for a response. It sends a response from the server to the web browser.

**Module location**: `[installation folder]\routes\` folder

**Components of the layer:**

- **index.js** -- handling common routes

| **URL**         | **Parameters**   | **Method** | **Function**                                                                 |
|-----------------|------------------|------------|------------------------------------------------------------------------------|
| /               | -                | GET        | Loads the home page                                                          |
| /cars           | -                | GET        | Loads all cars                                                               |
| /cars/:page     | page: page number| GET        | Loads a template with 30 cars, according to the specified page number        |
| /search         | -                | GET        | Loads the search page                                                        |
| /search         | -                | POST       | Extracts the necessary parameters/conditions from the body and returns the elements that match the search. |
| /car/:id        | id: car ID       | GET        | Loads the car's data sheet based on the ID                                   |

- **users.js** -- handling routes related to user management

| **URL**              | **Parameters**   | **Method** | **Function**                                                                 |
|----------------------|------------------|------------|------------------------------------------------------------------------------|
| /user/login          | -                | GET        | Loads the login page                                                         |
| /user/login          | -                | POST       | Extracts the necessary parameters/conditions from the body and logs the user in accordingly. |
| /user/registration   | -                | GET        | Loads the registration page                                                  |
| /user/registration   | -                | POST       | Registers the user based on the parameters retrieved from the body           |
| /user/accounts       | -                | GET        | Loads the list of users                                                      |
| /user/profile        | -                | GET        | Loads user data                                                              |
| /user/favorites      | -                | GET        | Loads the user's favorite cars                                               |
| /user/edit           | -                | GET        | Loads the page where the user can edit their information                     |
| /user/edit           | -                | POST       | Loads the page where the user can edit their information                     |
| /user/addFavourite   | -                | POST       | Extracts the car ID from the body and adds it to the user's favorites        |
| /user/removeFavourite| -                | POST       | Extracts the car ID from the body and removes it from the user's favorites   |
| /user/reset-password | -                | GET        | Displays the web page for generating a new password.                         |
| /user/reset-password | -                | POST       | Checks whether the given email address is found in the database, if not it displays the page again with an error message, if so it generates a 10-character long random password and sends it to the user's email address using the fetch API. |
| /user/logout         | -                | GET        | Logs out the user.                                                           |

**Controller Layer:**

The Controller Layer handles the business logic of the application. This means that the data is transformed or calculated to meet the requirements of the database model before being sent to the server. It is part of the router layer.

**Data Management Layer:**

The data management layer (Models) has access to the database to create, delete, or edit data.

The parameters required for the database are contained in the `[installation folder]\db\dbconfig.js` file:

```javascript
const config = {
  connectionLimit: 10,
  password: 'root',
  user: 'root',
  database: 'auto',
  host: 'localhost',
  port: 3306,
  dateStrings: true
};
```

After installation, the parameters must be set according to local conditions.

For the installed version, it is recommended to create a user with limited privileges on the MySQL server and connect with this user.

- **connectionLimit**: Specifies how many people can connect to the database at the same time via the web client.
- **password**: The password for the user.
- **user**: The name of the user connected to the MySQL server.
- **database**: Name of the database.
- **host**: If the SQL server and the web server are installed on separate machines, the hostname of the MySQL server machine must be entered here.
- **port**: The port on which the MySQL server is running.
- **dateStrings**: Easier handling of dates.

**Responsibilities of the layer:**

This is the layer where all requests and responses from the server logic are handled. The Data Access Layer methods receive variables from the controller layer. These variables are required for SQL queries. Based on the response received from the SQL server, it sends a Promise, which is an object. The object is defined after the server response is available. If the request is successful, the DAL promise is resolved into an object that is returned to the service layer, which in turn is returned to the routing layer. When the routing layer receives the object returned by the service layer, the routing layer sends the object in JSON format to the View layer.

**Module location**: `[installation folder]\db\dboperation.js`

**Components of the layer:**

| **Name**             | **Parameters**        | **Function**                                                                 |
|----------------------|-----------------------|------------------------------------------------------------------------------|
| Select30             | - pageNo: page number | Queries all data for 30 cars, offset by the page number                      |
| SelectAll            | -                     | Queries all car data in the database                                         |
| SelectOne            | - carId               | Queries all data of a car, based on the car ID                               |
| SelectAllSpecial     | -                     | Queries the ID, manufacturer, model, year, and description text of the cars in the special offers |
| CountElements        | -                     | Queries how many cars are in the database                                    |
| SelectAllMake        | -                     | Queries all manufacturers                                                    |
| SelectAllCondition   | -                     | Queries all statuses                                                         |
| SelectAllColor       | -                     | Queries all colors                                                           |
| SelectAllFuel        | -                     | Queries all fuel types                                                       |
| SelectAllType        | -                     | Queries all exports                                                          |
| SelectAllTransmission| -                     | Queries all bill types                                                       |
| SelectAllDrive       | -                     | Queries all drives                                                           |
| SelectModelByMake    | -                     | Queries all models and manufacturers, grouped by manufacturer                |
| SelectMaxPrice       | -                     | Queries the price of the most expensive car                                  |
| SelectMinYear        | -                     | Queries the year of the oldest car                                           |
| SelectMaxYear        | -                     | Queries the latest car year                                                  |
| EditUser             | - name: user's modified name, -email: user's modified email address, -username: user's modified username, -id: user ID | Modifies the fields for the user with the specified ID according to the parameters |
| VerifyUser           | - username: username, -password: password | Checks whether the username-password pair specified in the parameters is found in the database. The password must be encrypted during the query. |
| VerifyUserById       | - id: user ID, -password: password specified by the user | Checks whether the ID-password pair specified in the parameters is found in the database. The password must be encrypted during the query. |
| CheckEmail           | -email: email address provided by the user | Queries all records where the email address matches the one specified in the parameter. |
| NewPassword          | -email: specified email address, -password: the newly generated password | Changes password based on email address. |
| NewUser              | - username: username, -password: password, -name: full name, -email: email address, -letters: do you subscribe to newsletters? | Inserts a new user into the database according to the specified parameters. Their privilege level will automatically be set to 1. |
| AllUsers             | -                     | Queries all data for all users                                               |
| SelectUser           | - userId: user ID     | Queries all data for a user, according to the specified ID.                  |
| CheckUsed            | - username: username, -email: email address | Queries the data of all users with the specified username or email address. |
| NewFavorite          | - userId: user ID, -carId: car ID | Adds the car to the user's favorites. |
| RemoveFavorite       | - userId: user ID, -carId: car ID | Removes the car from the user's favorites. |
| Favorites            | - userId: user ID     | Queries all favorite cars belonging to the specified user                    |
| CheckFavorite        | - userId: user ID, -carId: car ID | Queries cars matching the parameters from the favorites table. |
| Filter               | - make: manufacturer, -models: array, contains models, -years: array, contains the lower and upper limits of the year, -prices: array, contains the lower and upper limits of the price, -conditions: array, contains conditions, -colors: array, contains colors, -fuels: array, contains fuel types, -types: array, contains types, -transmissions: array, contains transmissions, -drives: array, contains drives | Returns all data for all cars that meet the conditions, according to the specified parameters. |

**View Layer:**

The HTML page (render), the EJS template engine is responsible.

**Module location**: `[installation folder]\views` folder

**Layer responsibility:**

It generates the output HTML format based on the parameters received in JSON format and the template defined in the EJS file. It returns the code of the generated HTML page to the routing layer.

**Components of the layer:**

| **Name**             | **Required input**    | **Function**                                                                 |
|----------------------|-----------------------|------------------------------------------------------------------------------|
| 30scroll.ejs         | - list: array containing the car data | Loads as many car cards as you receive                                      |
| accounts.ejs         | - list: array containing user data | View user list                                                              |
| allList.ejs          | -                     | The frame of a list of all cars, then using 30scroll.ejs and the URL "/cars/:page", loads the cars in 30th increments as the user scrolls down |
| car.ejs              | - images: array containing the names of the images belonging to the car, -list: an array that has one element that contains the data for a given car, -favourite: a variable that contains whether the car is added to the user's favourites, by default false | Display car data |
| editProfile.ejs      | - lastname: variable, contains the user's last name, -firstname: user's first name, -email: user's email address, -username: user's username | Here the user can view their data |
| emailSent.ejs        | -email: the email address to which the email was sent | Here the user will receive a confirmation that the email containing the new password has been sent. |
| error.ejs            | - msg: object containing the error details | If the server runs into an error, it will display here                     |
| favorites.ejs        | - list: array containing the user's favorite cars | Displays the user's favorite cars                                           |
| footer.ejs           | -                     | Includes footer                                                             |
| getEmail.ejs         | - emailError: default value is false, it will be true if the user enters a wrong email address that is not in the database | An interface where the user can enter their password to request a new password. |
| icon.ejs             | -                     | Responsible for displaying the icon for the website                         |
| index.ejs            | - specials: array containing the special offers cars | Displays the home page.                                                     |
| login.ejs            | - loginError: false by default, will be true if the user entered incorrect data during login | Displays the login page.                                                    |
| navbar.ejs           | - allPage: if the user is on All pages, then true, otherwise false, -searchPage: if the user is on the Search page, then true, otherwise false, -loggedIn: Is the user logged in, if so true, otherwise false, -username: Username of the logged in user, -permission: Contains the permission level of the logged in user, -loginPage: if the user is on the Login tab, then true, otherwise false | Responsible for displaying the navigation bar. |
| profile.ejs          | - list: array containing the data of a user | Displays data related to the user.                                          |
| registration.ejs     | - usedData: variable, defaults to false, will be true if the username or email address is already taken, -lastname: variable, contains the last name of the registering user, -firstname: variable, contains the first name of the registering user, -password: variable, contains the password of the registering user, -passwordAgain: variable, contains the password entered again by the registering user | Displays the registration form. In case of incorrect data, the user does not have to enter all the data again. |
| search.ejs           | - modelsWithMake: an array containing the models belonging to the selected brand, -makes: array containing all manufacturers, -minYear: the year of the smallest car, -maxYear: the year of the latest car, -maxPrice: price of the most expensive car, -conditions: an array containing all the conditions, -colors: an array containing all colors, -fuels: the array containing all fuels, -types: an array containing all the versions, -transmissions: the array containing all transmissions, -drives: the array containing all drives | You are filling out a form to filter cars. |

To convert the content from page 16 of the provided DOCX file into a README format, I will extract the relevant sections and format them appropriately. Below is the converted content:

---

# Desktop Application

## Development Environment:
- **Visual Studio**
- **MySQL for Visual Studio**

## Programming Language:
- **C#**

## Operating System:
- **Windows**

## Framework:
- **.NET Framework 4.8 Advanced Services**

## Libraries:
- **ADO.NET library**
- **Connector/NET for MySQL 8.0.28 x86**

---

# Web App

## Development Environment:
- **NodeJS**

## Programming Language:
- **JavaScript**

## Operating System:
- **Windows/Linux**

---

# External Libraries

- **express**: `~4.16.1`, web server framework
  - Express is a web application framework that offers a wide range of features for creating web and mobile applications. It helps in managing servers and routes.

- **express-session**: `^1.17.3`, session management
  - An HTTP server-side framework used to create and manage session middleware.

- **bootstrap**: `^5.2.3`, bootstrap handling
  - Bootstrap is a popular CSS framework.

- **cookie-parser**: `~1.4.4`
  - A cookie parser is a middleware that parses cookies attached to the client's request object.

- **cors**: `^2.8.5`, Cross-Origin Resource Sharing
  - It allows the front-end to send requests to an external back-end server. It is needed for emailjs.

- **debug**: `~2.6.9`, for development
  - A process that identifies errors.

- **drop**: `^3.1.8`
  - A simple templating language/engine that allows the user to generate HTML with simple JavaScript.

- **https**: `^1.0.0`
  - Allows the use of the HTTPS protocol.

- **http-errors**: `~1.6.3`
  - Helps in tracing the origin of HTTP errors.

- **Morgan**: `~1.9.1`
  - Morgan is an HTTP request-level middleware. It logs requests along with some other information depending on its configuration and the preset used. It is useful during debugging and when creating log files.

- **mysql2**: `^3.0.1`
  - An adapter library for accessing the MySQL database.

- **node-fetch**: `^2.6.9`
  - Fetch API request from JavaScript.

- **nodemon**: `^2.0.20`
  - Automatically restarts the server after each modification, saving developers time.

- **path**: `^0.12.7`
  - A string that uniquely identifies a location in a directory structure.

- **fs**: `^0.0.1-security`
  - Allows reading files from folders.

### Dependencies

**MySQL Server 8.0.27 database server**

#### Minimum Hardware Requirements:

- **Processor**: 1 gigahertz (GHz) or faster processor
- **RAM**: 1 gigabyte (GB) for 32-bit systems or 2 GB for 64-bit systems
- **Hard disk space**: 16 GB for 32-bit operating system or 20 GB for 64-bit operating system
- **Video card**: DirectX 9 or later compatible with WDDM 1.0 driver
- **Display**: 1024x600 or higher resolution

#### Recommended Hardware Requirements:

- **Processor**: 2.5 gigahertz (GHz) or faster processor
- **RAM**: 2 gigabytes (GB) for 32-bit systems or 4 GB for 64-bit systems
- **Hard disk space**: 20 GB for 32-bit operating system or 30 GB for 64-bit operating system
- **Video card**: DirectX 9 or later compatible with WDDM 1.0 driver
- **Display**: 1920x1080 or higher resolution

#### Desktop App:

- **Operating System**: Windows 10
- **Framework**: .NET framework 4.8 Advanced Services

#### Web App:

- **Windows/Linux**
- **NodeJS**
- **Complete folder structure**
- **Install dependencies found in package.json file** (npm install or the included node_modules folder)
- **Certificate**, if you have your own

---

## Modules

### Overview

The software architecture is divided into the following modules and components.

The system consists of two main modules:

1. **Desktop Application**: An application used to implement administrator functions. It provides an interface for managing the master data used in the system.
   - **Master Data Module**:
     - Your status
     - Cars
     - Manufacturers
     - Designs
     - Drives
     - Colors
     - Fuels
     - Gearboxes
     - Specials
   - **Users Module**:
     - Users
     - Favorites
   - **Application Operation**:
     - When you start the application, a login window will pop up. Here you must enter your username and password. If you log in successfully, the window will close.
![Figure 5](media/image5.png)     
     - In the application, you can view all tables in the database by navigating in the menu bar. When you open the Master Data tab, all tables are displayed.
![Figure 5](media/image5.png)     
     - Among the many tables, the administrator can make changes in the Cars table.
![Figure 5](media/image5.png)
     - If you select a new car in the list, all of its images will be displayed above. Images can be deleted using the Delete Image button, or new images can be uploaded using the New Image button. You can select and upload multiple images at once. You can modify the data of the selected car in the menu on the right.
     - It is also possible to filter in the small menu above the list. After setting the appropriate values and pressing the Filter button, only cars that meet the conditions will be displayed in the list.
     - You can print the cars in the list by clicking the blue button in the menu bar.

2. **WEB Server**:
   - **Product Display**: Displays all cars for sale.
   - **Favorites**:
     - The cars selected by the registered user are recorded in the database as their favorites.
   - **Filtration**:
     - You can filter cars based on different criteria.
   - **User Management**:
     - **Login**: You can log in with a username and password.
     - **Registration**: After providing the required information, the user's data will be saved in the database.
     - **Modify Data**: After providing the requested data, the user can modify their data.
     - **Generate a New Password**: In case of a forgotten password, a new generated password will be sent to the user's email address.
   - **Special Offers**:
     - In the database, a table called specials stores the car ID and its description. Cars that are found in the table are displayed on the main page.

---

## Persistence

### Data Storage:

- **MySQL database**
- **Storing images in file system folders**

#### The Chosen Method of Storage

**MySQL**:

MySQL is a multi-user, multi-threaded, SQL-based relational database management server. It can run on a variety of platforms. It is capable of storing, manipulating, and displaying data in tables. It operates as a client-server system.

**Storing Files/Images**:

The images are stored in a separate folder for each car.

The car images are stored in the installed folder of the web application, located at: `[installation folder]\public\src\database\[car ID]\`

Each car has an index image and additional higher-resolution images.

### Conceptual Data Model

**ERD Diagram**:

![Figure 5](media/image5.png)

**Tables**:

- **auto**: This is the main board.
  - **id**: Unique identifier of the car. Integer. Primary key.
  - **gyartoid**: The car manufacturer's identifier. Integer. Foreign key.
  - **model**: The model of the car. Text.
  - **ev**: Year of the car. Integer.
  - **ar**: Price of the car in HUF. Whole number.
  - **allapotid**: The identifier of the car's status. Integer. Foreign key.
  - **colorid**: The identifier of the car's color. Integer. Foreign key.
  - **cylinder head**: The number of cylinder heads in the car. Integer.
  - **fuel**: Identifier of the fuel required to operate the car. Integer. Foreign key.
  - **km**: The car's odometer reading. Whole number.
  - **valtoid**: The identifier of the car's transmission type. Integer. Foreign key.
  - **chassis**: The chassis number of the car. Text.
  - **drivetrain**: The drivetrain identifier of the car. Integer. Foreign key.
  - **versionid**: The identifier of the car version. Integer. Foreign key.

- **manufacturer**:
  - **id**: Unique identifier of the manufacturer/brand. Integer. Primary key.
  - **manufacturer**: Manufacturer/brand name. Text.

- **status**:
  - **id**: Unique identifier of the state. Integer. Primary key.
  - **status**: Name of the status. Text.

- **color**:
  - **id**: Unique identifier of the color. Integer. Primary key.
  - **color**: Name of the color. Text.

- **fuel**:
  - **id**: Unique identifier of the fuel type. Integer. Primary key.
  - **fuel**: Name of the fuel type. Text.

- **change**:
  - **id**: Unique identifier of the bill type. Integer. Primary key.
  - **switch**: Name of the switch type. Text.

- **drive**:
  - **id**: Unique identifier of the drive type. Integer. Primary key.
  - **drive**: Name of the drive type. Text.

- **design**:
  - **id**: Unique identifier of the export. Integer. Primary key.
  - **version**: Name of the version. Text.

- **special**:
  - **id**: Unique identifier of the special offer. Integer. Primary key.
  - **autoid**: The car ID associated with the offer. Integer. Foreign key.
  - **text**: Text describing the car. Text.

- **favorites**:
  - **id**: Unique identifier of the favorite. Integer. Primary key.
  - **userId**: The ID of the user to whom the car listed as a favorite belongs. Integer. Foreign key.
  - **carId**: The ID of the car that the user has added to their favorites. Integer. Foreign key.

- **users**:
  - **id**: Unique identifier for the user. Integer. Primary key.
  - **username**: The username associated with the user. Text.
  - **password**: The password for the user, which is stored encrypted. Text.
  - **name**: The user's full name. Text.
  - **email**: The user's email address. Text.
  - **createdate**: Date the user was registered. It is automatically created. Date.
  - **right**: The user's permission level. Integer.
  - **newsletter**: Whether the user has subscribed to the newsletter. Tinyint.

**Relations**:

| **Foreign Key**         | **Primary Key**           | **Connection Type** |
|-------------------------|---------------------------|---------------------|
| auto.manufacturer        | manufacturer.id           | One to many         |
| auto.status              | allapot.id                |                     |
| auto.sinid               | color.id                  |                     |
| auto.fuel                | fuel.id                   |                     |
| auto.valtoid             | valto.id                  |                     |
| auto.drive               | drive.id                  |                     |
| auto.export              | execution time            |                     |
| special.autoid           | auto.id                   |                     |
| favorites.userId         | users.id                  |                     |
| favorites.carId          | auto.id                   |                     |

---

## Processes

- **Car Presentation (Specials + Search)**: Loads the data from the database about the car selected by the user. In addition, you can add it to your favorites. Last but not least, you can filter among all cars even with combined conditions.
- **Login**: The registered user is identified based on a username-password pair. After this, they receive the assigned authorization level, which is stored in the session.
- **Registration**: After the user has entered the required data, the system stores their data in the database, the password of course encrypted.
- **Logout**: Terminates the session used by the user.
- **View/Modify User Data**: The user can view and even modify their own data.

---

## User Documentation

### General Visitor:

To open the website, first open a browser (Google Chrome, Mozilla Firefox, Brave, etc.) and enter the following in the header: `https://localhost/`. This will open the homepage of our website.

#### Home Page:

The home page contains the company's current special offers. You can also browse through them. They can be moved left and right by clicking on the two arrows. If you click on a car, you will be able to view its profile page. In addition, the home page has a navigation bar at the top.

![Figure 6](media/image6.png)

#### Navigation Bar:

The navigation bar accompanies you throughout all pages. On the left side, you can find the company logo, which, when clicked, always loads you back to the home page. On the right side, there are 3 menus:

- **All**: Click here to view all cars in the car dealership, listed in alphabetical order.
- **Search**: Clicking this will open the search page where you can filter vehicles based on various criteria.
- **Login**: Clicking this will open the login window, where you can log in using your username and password.
- If you are already logged in, your name will appear instead of the "Login" menu. This menu is divided into 3 parts:
  - **Favorites**: Opens the page where you can view all the cars you have added to your favorites.
  - **My Data**: You can view all your personal data and modify it.
  - **Log Out**: Logs you out of your account.

![Figure 7](media/image7.png)  
![Figure 8](media/image8.png)

#### Footer:

The **footer** at the bottom of the page is the same on every page. The footer contains various information about the company, such as contact information. You can also find the company's other pages: Facebook, YouTube, Instagram. These are all links, which when clicked on will open the website in a new window.

![Figure 9](media/image9.png)

#### All:

If you click on the "All" box in the navigation bar, you can view every car the company has for sale. The cars are arranged in rows of 3 cars per row. The cars are loaded in increments of 30, and the next 30 are loaded as you scroll down the page until you reach the last car. Each car has its own card, which contains only the most important information: manufacturer, model, price, mileage, year. There is also a picture of each car, and at the bottom of the card, there is a "View" button. The "View" button opens the car's data sheet, where you can find more information about the cars.

![Figure 10](media/image10.png)

#### Car Data Sheet:

If you click on the "View" button, the car's data sheet will open. This page now has much more information about the cars, everything in fact. Here, not just one, but several images of the vehicle are displayed, which can be scrolled left and right using the white arrows. On the right side, the car's properties are listed: manufacturer, model, price, year, condition, version, chassis number, mileage, color, fuel type, number of cylinder heads, drive, transmission type. Furthermore, at the bottom right, you will find a red "Add to Favorites" button. For the button to work, you must be logged in. If you are not logged in, the page will redirect you to the login window. If you are logged in, the car has been successfully added to your favorites. In this case, the button will change to "Cancel Favorites". If you click the button labeled "Unfavorite", the car will be removed from your favorites and the button will be labeled "Add to Favorites" again.

![Figure 11](media/image11.png)  
![Figure 12](media/image12.png)

#### Search:

If you clicked on the "Search" menu in the navigation bar, you can search/filter cars. The search can consist of multiple criteria, but none of the fields are mandatory:

- **Manufacturer**: By default, it is labeled "All", which means that cars from all manufacturers will be included in the search. If you would like to filter by manufacturer, click on the drop-down list labeled "All" and select the desired manufacturer. In this case, the name of the field will change to the manufacturer you selected.
- **Model**: This field is not available until you select a manufacturer. As long as the "Manufacturer" field is set to "All", this field is not available. Once you select a manufacturer, the drop-down list will be available. If you open the list, all available models of the selected manufacturer will be displayed. Here you can select not only one, but also more. To select a model, you need to check the box to the left of the model name with a single click. If you do not select any, all models will be entered into the search.
- **Year**: You can set the year of the car between 2 years. When you open the page, this is set to load each car individually. If you want to change it, you can do so in two ways. There are two fields for both the lower and upper limits. A slider and another field that displays the selected year. Use the cursor to hold down the dot on the slider and then release it until you find the year, or type the exact year in the field below the slider.
- **Price**: You can set the price of the car between 2 amounts. When you open the page, this is set to load each car individually. If you want to change it, you can do so in two ways. There are two fields for both the lower and upper limits. A slider and another field that displays the selected price. Press and hold the dot on the slider with your cursor until you find the desired amount, or type the exact amount in the field below the slider.
- **Status**: If you open the list, all the statuses will be displayed. As with the model, you can select more than one here. To select the statuses, you need to check the box to the left of the status name with a single click. If you do not select any, all the statuses will be entered into the search.
- **Color**: If you open the list, all available colors will be displayed. As with the model, you can select more than one. To select colors, you need to check the box to the left of the color name with a single click. If you do not select any, all colors will be entered in the search.
- **Fuel**: If you open the list, all fuel types will be displayed. As with the model, you can select more than one. To select the states, you need to check the box to the left of the state name with a single click. If you do not select any, all fuels will be entered into the search.
- **Design**: If you open the list, all available designs will be displayed. As with the model, you can select more than one. To select designs, you need to check the box to the left of the design name with a single click. If you do not select any, all designs will be entered into the search.
- **Transmission**: If you open the list, all available transmission types will be displayed. As with the model, you can select more than one. To select the transmissions, you need to check the box to the left of the transmission type name with a single click. If you do not select any, the search will return all cars with that transmission type.
- **Drive**: If you open the list, all available drives will be displayed. As with the model, you can select more than one. To select drives, you need to check the box to the left of the drive name with a single click. If you do not select any, all drives will be entered in the search.

Once you have selected all the criteria you want, click on the button labeled "Search". Once you have clicked on it, all the cars that match the criteria you have set will appear at the bottom of the page. The cars will be displayed in the same way as in the "All" menu.

![Figure 13](media/image13.png)

#### Login:

If you click on the button labeled "Login" in the navigation bar, the window where you can log in will open. There are 2 fields: "Username" and "Password". Enter your username and password in the fields, then click on the button labeled "Login". If you do not have a user account yet, click on the link labeled "Not registered yet?"

![Figure 14](media/image14.png)

#### Forgot Password:

After an incorrect login, a link will appear on the login tab with the text: "Forgot your password?". By clicking this button, you will be redirected to another interface, where after entering the email address associated with the account, clicking the "Send" button will send a newly generated password to the provided email address. If you enter an email address that is not registered, you will receive an error message saying "Such an email address is not registered."

![Figure 15](media/image15.png)  
![Figure 16](media/image16.png)

#### Registration:

The registration window contains several fields:

- **Last name**: Enter your last name. This field is required.
- **First name**: Enter your first name. This field is required.
- **Email address**: Enter your email address. This field is required.
- **Username**: Come up with a username for yourself and then enter it. This field is required.
- **Password**: Create a password for yourself and enter it. The password must be at least 8 characters long. This field is required.
- **Password again**: Enter the password you created again. Registration will only be successful if the two passwords match. This field is required.
- **I have read and accept the Terms and Conditions and Privacy Policy**: Checking this box is mandatory. By doing so, you accept the Terms and Conditions and Privacy Policy.
- **Newsletter subscription**: Check this box if you would like to receive newsletters from the site to your email account. (Sending newsletters will be a later feature on the website).

Once you have filled in all the fields, press the "Register" button. Registration will only be successful if neither the username nor the email address is already in use by another user, and the two passwords entered are the same and at least 8 characters long. After that, the site will successfully log you in and you can access the new features.

If you already have an account and would like to log in, click on the "Already registered" link at the bottom of the form, which will redirect you to the login page.

![Figure 17](media/image17.png)

#### Favorites:

This submenu is only available if you are already logged in. All cars you have added to your favorites are displayed here, just like in the "All" menu.

#### My Details:

This submenu is only available if you are already logged in. Here you can find all the information related to your user account (name, username, email address, account creation date, newsletter subscription). You can change this information by clicking on the "Change data" button.

![Figure 18](media/image18.png)

#### Change Data:

If you clicked on the "Change data" button, a form will appear where you can change the following data: last name, first name, email address, username. To change it, you must enter your password. If you have entered the correct data, press the "Change" button, and if you have entered the password correctly and the email address and username are not taken, the data change is successful.

![Figure 19](media/image19.png)

#### Logout:

By clicking this button, you will log out of the user's account.

---

### Administrator:

If you are logged in as an administrator, a new submenu appears between "My Info" and "Log Out": "User Accounts".

#### User Accounts:

By clicking on this menu, you can view the data of all registered users. The only information missing is the password, as it is stored encrypted.

![Figure 20](media/image20.png)

---

## Resources

### Database:

The database was downloaded from [kaggle.com](https://kaggle.com) and modified to suit the project's needs.

### Concepts:

- **HTML5**: [https://hu.wikipedia.org/wiki/HTML](https://hu.wikipedia.org/wiki/HTML)
- **express**: [https://expressjs.com/](https://expressjs.com/)
- **express-session**: [https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/](https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/)
- **cookie-parser**: [https://www.tutorialspoint.com/expressjs/expressjs_cookies.htm](https://www.tutorialspoint.com/expressjs/expressjs_cookies.htm)
- **ejs**: [https://ejs.co/](https://ejs.co/)
- **morgan**: [https://www.npmjs.com/package/morgan](https://www.npmjs.com/package/morgan)
- **MySQL**: [https://hu.wikipedia.org/wiki/MySQL](https://hu.wikipedia.org/wiki/MySQL)

### Pictures:

All images were downloaded from Google Image Search.

### Program Details:

The class for printing the DataGridView was downloaded from [https://www.codeproject.com/Articles/18042/Another-DataGridView-Printer](https://www.codeproject.com/Articles/18042/Another-DataGridView-Printer) and modified for use in this project.
