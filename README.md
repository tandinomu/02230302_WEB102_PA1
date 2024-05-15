# Building a RESTful API with Node.js Standard Libraries

This assignment sets up a simple server using Node.js and conducts CRUD (Create, Read, Update, Delete) operations on a collection of products. Data persistence is ensured by storing product information in the JSON file named products.json, allowing for continuity across server restarts.

## Setup

- Clone this repository.
- Open the terminal.
   - Initiate the server by executing node server.js command.
   - Then server will commence listening on http://localhost:3000

## API Endpoints

### GET /products:

Description: Retrieves a list of all products.

HTTP Method: GET

Response: A JSON array containing all products. When a product ID is provided as a query parameter, the server returns the details of that specific product.

### POST /products

Description: Creates a new product.

HTTP Method: POST

Request Body: A JSON object representing the new product.

Response: A JSON object representing the newly created product.

### PUT /products/:id

Description: Updates an existing product.

HTTP Method: PUT

URL Parameter: id - The ID of the product to update.

Request Body: A JSON object with the fields to update.

Response: A JSON object representing the updated product.

### PATCH /products/:id

Description: Partially updates an existing product.

HTTP Method: PATCH

URL Parameter: id - The ID of the product to update.

Request Body: A JSON object with the fields to update.

Response: A JSON object representing the updated product.

### DELETE /products/:id

Description: Deletes an existing product.

HTTP Method: DELETE

URL Parameter: id - The ID of the product to delete.

Response: A JSON object representing the deleted product.

## Error Handling

#### File I/O Errors
- If there is an error while reading or writing to the data file (`products.json`), the server responds with a `500 Internal Server Error` status code, indicating a problem with the server.

#### JSON Parsing Errors
- Errors related to parsing JSON data from request bodies are handled with a `400 Bad Request` status code and an error message indicating an invalid request body.

#### HTTP Request Processing Errors
- If the server encounters errors during HTTP request processing, such as invalid request methods or unsupported endpoints, it responds with appropriate HTTP status codes:
  - `404 Not Found`: Indicates that the requested resource or endpoint does not exist.
  - `405 Method Not Allowed`: Indicates that the requested HTTP method is not supported for the given endpoint.

#### General Error Handling
- For any other unexpected errors, the server responds with a generic `500 Internal Server Error` status code, providing minimal details to prevent exposing sensitive information.
