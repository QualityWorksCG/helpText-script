# HelpText-script

# Prerequisite

User should have aws-sdk installed and set up on their computer. 

# Installation

Clone this project from

```bash
  https://github.com/QualityWorksCG/helpText-script.git
```
Navigate to the directory and install the npm packages using

```bash
  npm install
```

Create a .env file by duplicating **.env.sample**.

Update the varibales for REGION and FILE_PATH in your .env file to match the region of your database and the file path of the csv file with the information.  

Run the script by using the command.

```bash
  node HelpText.js
```

## Appendix

An example of the csv file format required can be found [here](https://drive.google.com/file/d/1jrE8ynXxB8c8evYz2KSC4ZZgMhR-WgTv/view?usp=sharing)


## Other Notes

The credentials that are used to login to the user's aws account will be set using the aws-sdk package.