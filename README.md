# electron-demo

Ext JS / Electron Helpers and Example App

## Setup

Complete the following steps to get the workspace fully initialized.

### 1. Install Ext JS

Get [Ext JS 6.2.0](https://www.sencha.com/products/extjs/#overview) and unzip it
in a directory:

    $ mkdir ~/sencha-frameworks
    $ cd ~/sencha-frameworks
    $ unzip ext-6.2.0-commercial.zip

You will now have a `"sencha-frameworks/ext-6.2.0"` directory.

(You can use any folder you like, but `"~/sencha-frameworks"` is convenient).

### Run The `setup` Script

If you are on Mac OS X or Linux, run this command first (at the root directory):

    $ chmod +x ./setup

Now to reinitialize the Sencha Cmd workspace and application, run this command:

    $ ./setup ~/sencha-frameworks

## Run

To run the example application, do the following from the root directory:

    $ npm run app
