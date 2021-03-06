// Vertex Shader Source Code

var x = 0.0;
var y = 0.0;
var z = 5.0;

var mouseXPosition = 0;
var mouseYPosition = 0;

var vertexShaderText =
    [
        'precision mediump float;',
        '',
        'attribute vec3 vertPosition;', // position vector
        '',
        'attribute vec3 vertColor;', // input color
        '',
        'varying vec3 fragColor;', // output color
        '',
        'uniform mat4 mWorld;', // global variable same across vertex and fragment shader
        '',
        'uniform mat4 mView;', // global variable same across vertex and fragment shader
        '',
        'uniform mat4 mProj;', // global variable same across vertex and fragment shader
        '',
        'void main()',
        '',
        '{',
        '',
        '   fragColor = vertColor;', // fragColor is a global variable and will be passed onto the fragment shader
        '',
        '   gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);', //  Bringing the model into the world space, then into the view and then projecting it
        '',
        '}'
    ].join('\n');

// Fragment Shader Source Code
var fragmentShaderText =
    [
        'precision mediump float;',
        '',
        'varying vec3 fragColor;', // output color
        '',
        'void main()',
        '',
        '{',
        '',
        '   gl_FragColor = vec4(fragColor, 1.0);',
        '',
        '}'
    ].join('\n');

// Initializer Function - Runs once every time the page loads
var canvas = document.getElementById('surface');
var init = function () {
    canvas.width = 800;
    canvas.height = 800;
    var gl = canvas.getContext('webgl'); // gets the opengl context that we are going to work on

    if(!gl) {
        alert('Falling back on experimental'); // for IE
        gl = canvas.getElementById('experimental-webgl');
    }
    if(!gl) {
        alert('No webgl 5 u!');
    }

    gl.clearColor(0.8, 0.5, 1.0, 1.0); // RGBA
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // color Buffer & depth buffer
    gl.enable(gl.DEPTH_TEST);


    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText); // create a vertex shader
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText); // create fragment shader

    var program = createProgram(gl, vertexShader, fragmentShader); // create a new program
    gl.useProgram(program); // use program


    var positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition'); // gets the location for vertPosition from the shader code to supply it some data
    var colorAttributeLocation = gl.getAttribLocation(program, 'vertColor'); // gets the location for vertColor from the shader code to supply it some data in RGB
    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld'); // gets the location of mWorld from the shader
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView'); // gets the location of mView from the shader
    var matProjectionUniformLocation = gl.getUniformLocation(program, 'mProj'); // gets the location of mProj from the shader

    var worldMatrix = new Float32Array(16); // initialize world matrix
    var viewMatrix = new Float32Array(16); // initialize view matrix
    var projMatrix = new Float32Array(16); // initialize projection matrix

    mat4.identity(worldMatrix); // converts 1D array into a 4x4 matrix, returns identity matrix by default
    mat4.identity(viewMatrix); // converts 1D array into a 4x4 matrix, returns identity matrix by default
    mat4.identity(projMatrix); // converts 1D array into a 4x4 matrix, returns identity matrix by default

    mat4.identity(worldMatrix);
    mat4.perspective(projMatrix, glMatrix.toRadian(45), (canvas.width/canvas.height), 0.1, 1000.0);

    gl.uniformMatrix4fv( // Basically sending data to the GPU
        matWorldUniformLocation,
        gl.FALSE, // Transpose karna a?
        worldMatrix
    );



    gl.uniformMatrix4fv( // Basically sending data to the GPU
        matProjectionUniformLocation,
        gl.FALSE, // Transpose karna a?
        projMatrix
    );



    // A good idea to validate the program - may be expensive
    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        console.log('Error validating program', gl.getShaderInfoLog(program));
        return;
    }


    var offset = 0.0;
    // Define vertices = 64 bit floating point precision, because our attribute is vec3 (takes 3 values of x, y, z)
    var trianglePoints =
        [// xyzrgb

            // Left Fan

            // Front
            -0.7 - offset,  0.0,   0.0,    244.0/255.0,    116.0/255.0,    90.0/255.0, //A
            -0.1 - offset,  0.1,   0.0,    244.0/255.0,    116.0/255.0,    90.0/255.0,  //B
            0.0 - offset,   0.0,   0.1,    244.0/255.0,    116.0/255.0,    90.0/255.0,  //0

            -0.7 - offset,  0.0,    0.0,    255.0/255.0,    42.0/255.0,    0.0/255.0, //A
            -0.1 - offset,  -0.1,   0.0,    255.0/255.0,    42.0/255.0,    0.0/255.0, //H
            0.0 - offset,   0.0,    0.1,    255.0/255.0,    42.0/255.0,    0.0/255.0, //0

            // Back
            -0.7 - offset,  0.0,    0.0,    244.0/255.0,    116.0/255.0,    90.0/255.0,  //A
            -0.1 - offset,  0.1,    0.0,    244.0/255.0,    116.0/255.0,    90.0/255.0,  //B
            0.0 - offset,   0.0,   -0.1,    244.0/255.0,    116.0/255.0,    90.0/255.0,  //0

            -0.7 - offset,  0.0,    0.0,    255.0/255.0,    42.0/255.0,    0.0/255.0, //A
            -0.1 - offset,  -0.1,   0.0,    255.0/255.0,    42.0/255.0,    0.0/255.0, //H
            0.0 - offset,   0.0,   -0.1,    255.0/255.0,    42.0/255.0,    0.0/255.0, //0

            // Right Fan

            // Front
            0.7 + offset,   0.0,    0.0,    175.0/255.0,    38.0/255.0,    10.0/255.0, //E
            0.1 + offset,   -0.1,   0.0,    175.0/255.0,    38.0/255.0,    10.0/255.0, //F
            0.0 + offset,   0.0,   0.1,    175.0/255.0,    38.0/255.0,    10.0/255.0, //0

            0.7 + offset,    0.0,    0.0,    255.0/255.0,    42.0/255.0,    0.0/255.0, //E
            0.1 + offset,   0.1,   0.0,    255.0/255.0,    42.0/255.0,    0.0/255.0, //D
            0.0 + offset,    0.0,   0.1,    255.0/255.0,    42.0/255.0,    0.0/255.0, //0

            // Back
            0.7 + offset,    0.0,    0.0,    175.0/255.0,    38.0/255.0,    10.0/255.0, //E
            0.1 + offset,   -0.1,   0.0,    175.0/255.0,    38.0/255.0,    10.0/255.0, //F
            0.0 + offset,    0.0,   -0.1,    175.0/255.0,    38.0/255.0,    10.0/255.0, //0

            0.7 + offset,    0.0,    0.0,    255.0/255.0,    42.0/255.0,    0.0/255.0, //E
            0.1 + offset,   0.1,   0.0,    255.0/255.0,    42.0/255.0,    0.0/255.0, //D
            0.0 + offset,    0.0,   -0.1,    255.0/255.0,    42.0/255.0,    0.0/255.0,  //0

            // Fan Three

            // Front
            0.0,    0.7,    0.0,    244.0/255.0,    116.0/255.0,    90.0/255.0, //C
            -0.1,   0.1,   0.0,    244.0/255.0,    116.0/255.0,    90.0/255.0, //B
            0.0,    0.0,   0.1,    244.0/255.0,    116.0/255.0,    90.0/255.0, //0

            0.0,    0.7,    0.0,    255.0/255.0,    42.0/255.0,    0.0/255.0, //C
            0.1,   0.1,   0.0,    255.0/255.0,    42.0/255.0,    0.0/255.0, //D
            0.0,    0.0,   0.1,    255.0/255.0,    42.0/255.0,    0.0/255.0, //0

            // Back
            0.0,    0.7,    0.0,    244.0/255.0,    116.0/255.0,    90.0/255.0, //C
            -0.1,   0.1,   0.0,    244.0/255.0,    116.0/255.0,    90.0/255.0, //B
            0.0,    0.0,   -0.1,    244.0/255.0,    116.0/255.0,    90.0/255.0, //0

            0.0,    0.7,    0.0,    255.0/255.0,    42.0/255.0,    0.0/255.0, //C
            0.1,   0.1,   0.0,    255.0/255.0,    42.0/255.0,    0.0/255.0, //D
            0.0,    0.0,   -0.1,    255.0/255.0,    42.0/255.0,    0.0/255.0, //0

            // Fan Four

            0.0,    -0.7,    0.0,    175.0/255.0,    38.0/255.0,    10.0/255.0, //G
            0.1,   -0.1,   0.0,    175.0/255.0,    38.0/255.0,    10.0/255.0, //F
            0.0,    0.0,   0.1,    175.0/255.0,    38.0/255.0,    10.0/255.0, //0

            0.0,    -0.7,    0.0,    255.0/255.0,    42.0/255.0,    0.0/255.0, //G
            -0.1,   -0.1,   0.0,    255.0/255.0,    42.0/255.0,    0.0/255.0, //H
            0.0,    0.0,   0.1,    255.0/255.0,    42.0/255.0,    0.0/255.0, //0

            // Back
            0.0,    -0.7,    0.0,    175.0/255.0,    38.0/255.0,    10.0/255.0, //G
            0.1,   -0.1,   0.0,    175.0/255.0,    38.0/255.0,    10.0/255.0, //F
            0.0,    0.0,   -0.1,    175.0/255.0,    38.0/255.0,    10.0/255.0, //0

            0.0,    -0.7,    0.0,    255.0/255.0,    42.0/255.0,    0.0/255.0, //G
            -0.1,   -0.1,   0.0,    255.0/255.0,    42.0/255.0,    0.0/255.0, //H
            0.0,    0.0,   -0.1,    255.0/255.0,    42.0/255.0,    0.0/255.0 //0





        ];

    var positionBuffer = gl.createBuffer(); // create a buffer on the GPU
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // define the type of buffer and bind it to the GPU buffer that will be globally used
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(trianglePoints), gl.STATIC_DRAW); // opengl accepts a strongly typed 32 bit floating point precision number
    // STATIC_DRAW tells WebGL we are not likely to change this data much

    gl.vertexAttribPointer(
        positionAttributeLocation, // attribute location
        3, // no of elements per attribute (vec3)
        gl.FLOAT, // data type of elements
        gl.FALSE, // is normalized?
        6 * Float32Array.BYTES_PER_ELEMENT, // size of individual vertex
        0 // offset from the beginning of a single vertex to this attribute (vec2)
    );

    gl.vertexAttribPointer(
        colorAttributeLocation, // attribute location
        3, // no of elements per attribute (vec3)
        gl.FLOAT, // data type of elements
        gl.FALSE, // is normalized?
        6 * Float32Array.BYTES_PER_ELEMENT, // size of individual vertex
        3 * Float32Array.BYTES_PER_ELEMENT // offset from the beginning of a single vertex to this attribute (vec3)
    );

    gl.enableVertexAttribArray(positionAttributeLocation); // activates the position attribute
    gl.enableVertexAttribArray(colorAttributeLocation); // activates the color attribute

    // Main render loop
    var rotationAngle = 0; // angle of rotation
    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
    var loop = function () {
        mat4.lookAt(viewMatrix, [x, y, z], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]); // output variable, eye location, center, up axis
        gl.uniformMatrix4fv( // Basically sending data to the GPU
            matViewUniformLocation,
            gl.FALSE, // Transpose karna a?
            viewMatrix
        );
        mat4.rotate(worldMatrix, identityMatrix, rotationAngle++/30, [0, 0, 0]); // rotating the world matrix about identity matrix, about x, y, and z axis
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix); // Send updates values to the GPU
        gl.clearColor(0.6, 0.6, 0.6, 1.0); // RGBA
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // color Buffer & depth buffer
        gl.drawArrays(gl.TRIANGLES, 0, 48); // 0 = no of elements to skip, 3 = no of vertices to draw
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

};





//------------FUNCTIONS----------------//





// Function for creating shader (vertex or fragment)
var createShader = function (gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    } else {
        console.log('Error compiling vertex shader', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
};

// Function for creating program
var createProgram = function (gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    } else {
        console.log('Error compiling vertex shader', gl.getShaderInfoLog(shader));
        gl.deleteProgram(program);
    }
};

var moveCamera = function (key) {
    if(key.keyCode == '119'){ // w
        z-=0.5;
    }
    if(key.keyCode == '97'){ // a
        x-=0.5;
    }
    if(key.keyCode == '115'){ // s
        z+=0.5;
    }
    if(key.keyCode == '100'){ // d
        x+=0.5;
    }
};

var getMouseCoordinates = function (event) {
    mouseXPosition = event.clientX/2;
    mouseYPosition = event.clientY/2;
    console.log(mouseXPosition);
    console.log(mouseYPosition);
};



// Register Events
window.addEventListener('keypress', moveCamera, false);
canvas.addEventListener('mousemove', getMouseCoordinates);

