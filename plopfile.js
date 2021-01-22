module.exports = function (plop) {
    plop.setGenerator('component', {
        description: 'Creating new react components',
        prompts: [
            {
                type: 'list',
                name: "input",
                message: 'Choose your component',
                choices: ['class', 'functional', 'screen'],
            },
            {
                type: "input",
                name: "name"
            }
        ],
        actions: function (data) {
            const actions = [];
            if (data.input === 'functional') {
                actions.push({
                    type: 'add', //adding file to your propject
                    templateFile: 'plop-templates/functional-component.hbs',
                    path: 'src/components/{{pascalCase name}}.tsx' //component path
                })
            } else if (data.input === 'class') {
                actions.push({
                    type: 'add',
                    templateFile: 'plop-templates/class-component.hbs',
                    path: 'src/components/{{pascalCase name}}.tsx'
                })
            } else {
                actions.push({
                    type: 'add',
                    templateFile: 'plop-templates/functional-component.hbs',
                    path: 'src/screens/{{pascalCase name}}.tsx'
                })
            }
            return actions;
        }
    });
};