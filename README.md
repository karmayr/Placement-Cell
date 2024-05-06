# Placement Cell

Placement Cell is a project built using Node.js, Express, and EJS. It facilitates the management of images for a placement cell, utilizing Cloudinary along with Multer for image storage. Certain environment variables stored in a `.env` file are necessary for the image upload functionality to work.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

## Installation

To set up Placement Cell on your local machine, follow these steps:

1. Clone the repository:

```bash
$ git clone https://github.com/karmayr/Placement-Cell.git
$ cd placement-cell
```
2. Install Dependencies:

```bash
$ npm install
```
3. Create a .env file in the root directory with the following variables:

```bash
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

#for Email
SMTP_MAIL = "your email address"
SMTP_PASSWORD = "your smtp password"
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = "587"
```

## Usage

*Run the application using
```bash
$node ./index.js
```
