# ext-electron
Ext JS / Electron Helpers and Example App

## Setup

Complete the following three steps to get the workspace fully initialized.

### 1. Install Node Packages

Install packages at the root (see below to use `yarn` instead of `npm`):

    $ npm install

#### Setup Using `yarn`

To get started using `yarn`, make sure you have `yarn` installed:

    $ npm install yarn -g

Then install Node packages at the root:

    $ yarn install

### 2. Install Ext JS

Get [Ext JS 6.2.0](https://www.sencha.com/products/extjs/#overview) and unzip it
in a directory:

    $ mkdir ~/sencha-frameworks
    $ cd ~/sencha-frameworks
    $ unzip ext-6.2.0-commercial.zip

You will now have a `"sencha-frameworks/ext-6.2.0"` directory.

(You can use any folder you like, but `"~/sencha-frameworks"` is convenient).

### 3. Install The Workspace

To reinitialize the Sencha Cmd workspace and application, run this command
at the root directory:

    $ sencha workspace install -f ~/sencha-frameworks

## Build The App

To build the application, do the following:

    $ cd app
    $ sencha app build --dev

## Run

To run the example application, do the following from the root directory:

    $ npm run app
