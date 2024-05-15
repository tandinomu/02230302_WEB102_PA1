const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = 3000;
const DATA_FILE = 'products.json';

const readProducts = (callback) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        const products = JSON.parse(data);
        callback(null, products);
    });
};

const writeProducts = (products, callback) => {
    fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), callback);
};

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    const pathname = reqUrl.pathname;
    const productId = reqUrl.pathname.split('/')[2];

    const handleResponse = (statusCode, data) => {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    };

    if (req.method === 'GET') {
        if (pathname === '/products') {
            readProducts((err, products) => {
                if (err) {
                    handleResponse(500, { error: 'Internal Server Error' });
                } else {
                    handleResponse(200, products);
                }
            });
        } else if (pathname.startsWith('/products/') && productId) {
            readProducts((err, products) => {
                if (err) {
                    handleResponse(500, { error: 'Internal Server Error' });
                    return;
                }
                const product = products.find(p => p.id === productId);
                if (!product) {
                    handleResponse(404, { error: 'Product not found' });
                } else {
                    handleResponse(200, product);
                }
            });
        } else {
            handleResponse(404, { error: 'Not Found' });
        }
    } else if (req.method === 'POST' && pathname === '/products') {
        let requestBody = '';
        req.on('data', chunk => {
            requestBody += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newProduct = JSON.parse(requestBody);
                readProducts((err, products) => {
                    if (err) {
                        handleResponse(500, { error: 'Internal Server Error' });
                        return;
                    }
                    newProduct.id = (products.length + 1).toString(); // Generating a unique ID
                    products.push(newProduct);
                    writeProducts(products, (err) => {
                        if (err) {
                            handleResponse(500, { error: 'Internal Server Error' });
                            return;
                        }
                        handleResponse(201, newProduct);
                    });
                });
            } catch (error) {
                handleResponse(400, { error: 'Invalid request body' });
            }
        });
    } else if (req.method === 'PUT' && pathname.startsWith('/products/') && productId) {
        let requestBody = '';
        req.on('data', chunk => {
            requestBody += chunk.toString();
        });
        req.on('end', () => {
            try {
                const requestData = JSON.parse(requestBody);
                readProducts((err, products) => {
                    if (err) {
                        handleResponse(500, { error: 'Internal Server Error' });
                        return;
                    }
                    const productIndex = products.findIndex(p => p.id === productId);
                    if (productIndex === -1) {
                        handleResponse(404, { error: 'Product not found' });
                        return;
                    }
                    products[productIndex] = requestData;
                    requestData.id = productId; 
                    writeProducts(products, (err) => {
                        if (err) {
                            handleResponse(500, { error: 'Internal Server Error' });
                            return;
                        }
                        handleResponse(200, requestData);
                    });
                });
            } catch (error) {
                handleResponse(400, { error: 'Invalid request body' });
            }
        });
    } else if (req.method === 'PATCH' && pathname.startsWith('/products/') && productId) {
        let requestBody = '';
        req.on('data', chunk => {
            requestBody += chunk.toString();
        });
        req.on('end', () => {
            try {
                const requestData = JSON.parse(requestBody);
                readProducts((err, products) => {
                    if (err) {
                        handleResponse(500, { error: 'Internal Server Error' });
                        return;
                    }
                    const productIndex = products.findIndex(p => p.id === productId);
                    if (productIndex === -1) {
                        handleResponse(404, { error: 'Product not found' });
                        return;
                    }
                    // Updating specific fields of the product
                    for (let key in requestData) {
                        if (key !== 'id') {
                            products[productIndex][key] = requestData[key];
                        }
                    }
                    writeProducts(products, (err) => {
                        if (err) {
                            handleResponse(500, { error: 'Internal Server Error' });
                            return;
                        }
                        handleResponse(200, products[productIndex]);
                    });
                });
            } catch (error) {
                handleResponse(400, { error: 'Invalid request body' });
            }
        });
    } else if (req.method === 'DELETE' && pathname.startsWith('/products/') && productId) {
        readProducts((err, products) => {
            if (err) {
                handleResponse(500, { error: 'Internal Server Error' });
                return;
            }
            const productIndex = products.findIndex(p => p.id === productId);
            if (productIndex === -1) {
                handleResponse(404, { error: 'Product not found' });
                return;
            }
            // Removing the product from the array
            products.splice(productIndex, 1);
            writeProducts(products, (err) => {
                if (err) {
                    handleResponse(500, { error: 'Internal Server Error' });
                    return;
                }
                handleResponse(204);
            });
        });
    } else {
        handleResponse(405, { error: 'Method Not Allowed' });
    }
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
