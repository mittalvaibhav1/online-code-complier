const compile = document.querySelector('button');
const textarea = document.querySelector('textarea');
const select = document.querySelector('select');
const url = 'https://codequotient.com/api/executeCode';
const output = document.querySelector('.output > p');
const line_numbers = document.querySelector('.line_numbers');
let start = 1;

select.addEventListener('change', () => {
    console.log('change', select.value);
    output.innerHTML = "";
    switch(select.value) {
        case '0': 
            textarea.value = `# Write your code here\nprint('Hello World');`;
            break;
        case '4':
            textarea.value = `// Write your code here\nconsole.log('Hello World');`;
            break; 
        case '7':
            textarea.value = `#include <stdio.h>\n\nint main() {\n // Write your code here\n printf("Hello World");\n}`
            break;
        case '77':
            textarea.value = `#include <iostream>\nusing namespace std;\n\nint main() {\n // Write your code here\n cout<<"Hello World";\n}`
            break;        
        case '8':
            textarea.value = `class Main {\n  public static void main(String[] args) {\n   // Write your code here\n   System.out.println("Hello World");\n }\n}`
            break;               

    }
});


compile.addEventListener('click', async () => {
    const code = textarea.value;
    const langId = select.value;
    output.innerHTML = 'Compiling...'
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            code,
            langId
        }),
        headers: {
            'Content-Type':'application/json'
        },
    })
    .then(response => {
        if(response.ok) return response;
        throw new Error('Error: ' + response.status + ' ' + response.statusText);
    })
    .then(response => response.json())
    .then(response => {
        if(response.codeId) {
            fetch_result(response.codeId);
        }
        else {
            //console.log('Error');
            output.innerHTML = response.error;
        }
    })
    .catch(err => {
        //console.log('Error');
        console.log(err.message);
    })
    
});

function setNumbering() {
    line_numbers.innerHTML = '';
    for(let i = start; i < start + 15; i++) {
        span = document.createElement('span');
        num = document.createTextNode(i);
        span.appendChild(num);
        line_numbers.appendChild(span);
    }
}

textarea.addEventListener('scroll',(e)=> {
    start = parseInt(e.target.scrollTop / 10 + 1);
    setNumbering();
})

async function fetch_result(codeId) {


    fetch('https://codequotient.com/api/codeResult/' + codeId)
    .then(response => {
        if(response.ok) return response;
        throw new Error('Error: ' + response.status + ' ' + response.statusText);
    })
    .then(response => response.json())
    .then(response => {
        response = JSON.parse(response.data);
        //console.log(response)
        if(response.output || response.errors) {
            if(response.output) {
                //console.log(response);
                output.innerHTML = response.output;
            }
            else if(response.errors) {
                //console.log(response);
                output.innerHTML = response.errors;
            }
        }
        else {
            //console.log('else');
            setTimeout(() => fetch_result(codeId),1000);
        }
    })
    .catch(err => {
        console.log(err.message);
    })
}

setNumbering();




