import * as inquirer from 'inquirer';
import * as  fs from 'fs';
import { ncp } from 'ncp';
// import * as path from 'path';

const copy = (source: string, destination: string) => new Promise((res, rej) => ncp(source, destination, (err) => {
  if(err) {
    rej(err);
  }else {

    // filesToCreate.forEach(file => {
    //   const origFilePath = `${templatePath}/${file}`;
      
    //   // get stats about the current file
    //   const stats = fs.statSync(origFilePath);
  
    //   if (stats.isFile()) {
    //     const contents = fs.readFileSync(origFilePath, 'utf8');
        
    //     const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
    //     fs.writeFileSync(writePath, contents, 'utf8');
    //   } else if (stats.isDirectory()) {
    //     fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);
        
    //     // recursive call
    //     createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
    //   }
    // });
    res();
  }
}));

const TEMPLATE_FOLDER = `${__dirname}/../templates`;

// const CHOICES = fs.readdirSync(`${__dirname}/../templates`);
const frontendChoices = fs.readdirSync(`${TEMPLATE_FOLDER}/frontend`);
const backendChoices = fs.readdirSync(`${TEMPLATE_FOLDER}/backend`);
const extraChoices = fs.readdirSync(`${TEMPLATE_FOLDER}/extras`);

const QUESTIONS = [
  {
    name: 'frontendChoice',
    type: 'list',
    message: 'What frontend would you like?',
    choices: frontendChoices
  },
  {
    name: 'backendChoice',
    type: 'list',
    message: 'What backend would you like?',
    choices: backendChoices
  },
  {
    name: 'extraChoices',
    type: 'checkbox',
    message: 'Any extras packages?',
    choices: extraChoices
  },
  {
    name: 'projectName',
    type: 'input',
    message: 'Project name:',
    validate: function (input: string) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else return 'Project name may only include letters, numbers, underscores and hashes.';
    }
  }
];


// inquirer.prompt(QUESTIONS)
//   .then(answers => {
//     console.log(answers);
// });

const extraNameMapping = {
  docz: 'ui'
};


const CURR_DIR = process.cwd();

inquirer.prompt(QUESTIONS)
  .then(async ({
    backendChoice,
    frontendChoice,
    extraChoices,
    projectName
  }: any) => {

    // const projectChoice = answers['project-choice'];
    // const projectName = answers['project-name'];
    // const templatePath = `${__dirname}/../templates/${projectChoice}`;
    const rootDest = `${CURR_DIR}/${projectName}`;
    fs.mkdirSync(rootDest);

    await copy(`${TEMPLATE_FOLDER}/root`, rootDest);

    const destination = `${rootDest}/packages`;
    fs.mkdirSync(destination);

    const serverDestination = `${destination}/server`;
    const webDestination = `${destination}/web`;

    // fs.mkdirSync(serverDestination);
    // fs.mkdirSync(webDestination);

    // createDirectoryContents(templatePath, projectName);
    await copy(`${TEMPLATE_FOLDER}/frontend/${frontendChoice}`, webDestination);
    await copy(`${TEMPLATE_FOLDER}/backend/${backendChoice}`, serverDestination);
    await Promise.all(
        extraChoices.map((extra: keyof typeof extraNameMapping) => {
          const dest = `${destination}/${extraNameMapping[extra] || extra}`;
          // fs.mkdirSync(dest);
          return copy(`${TEMPLATE_FOLDER}/extras/${extra}`, dest)     
        }
      )
    );

    // const filesToCreate = fs.readdirSync(templatePath);
  });

// function createDirectoryContents (templatePath: string, newProjectPath: string) {
//     const filesToCreate = fs.readdirSync(templatePath);
  
//     filesToCreate.forEach(file => {
//       const origFilePath = `${templatePath}/${file}`;
      
//       // get stats about the current file
//       const stats = fs.statSync(origFilePath);
  
//       if (stats.isFile()) {
//         const contents = fs.readFileSync(origFilePath, 'utf8');
        
//         const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
//         fs.writeFileSync(writePath, contents, 'utf8');
//       } else if (stats.isDirectory()) {
//         fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);
        
//         // recursive call
//         createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
//       }
//     });
//   }