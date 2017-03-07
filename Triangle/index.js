
// Vertex Shader Source Code
var vertexShaderText =
    [
        'precision mediump float;',
        '',
        'attribute vec2 vertPosition;', // postition vector
        '',
        'attribute vec3 vertColor;', // input color
        '',
        'varying vec3 fragColor;', // output color
        '',
        'void main()',
        '',
        '{',
        '',
        '   fragColor = vertColor;',
        '',
        '   gl_Position = vec4(vertPosition, 0.0, 1.0);',
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
var init = function () {
    var canvas = document.getElementById('surface');
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

    gl.clearColor(0.8, 0.5, 1.0, 1.0); //RGB
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // color Buffer

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText); // create a vertex shader
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText); // create fragment shader

    var program = createProgram(gl, vertexShader, fragmentShader); // create a new program

    var positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition'); // gets the location for vertPosition from the shader code to supply it some data
    var colorAttributeLocation = gl.getAttribLocation(program, 'vertColor'); // gets the location for vertColor from the shader code to supply it some data in RGB


    // A good idea to validate the program - may be expensive
    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        console.log('Error validating program', gl.getShaderInfoLog(program));
        return;
    }

    // Define vertices = 64 bit floating point precision, because our attribute is vec2 (takes 2 values)
    var trianglePoints =
        [// x    y      r    g    b
            0.0, 0.5,   1.0, 1.0, 0.0,
            -0.5, -0.5, 0.7, 0.0, 1.0,
            0.5, -0.5,  0.1, 1.0, 0.6
        ];

    var positionBuffer = gl.createBuffer(); // create a buffer on the GPU
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // define the type of buffer and bind it to the GPU buffer that will be globally used
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(trianglePoints), gl.STATIC_DRAW); // opengl accepts a strongly typed 32 bit floating point precision number
    // STATIC_DRAW tells WebGL we are not likely to change this data much

    gl.vertexAttribPointer(
        positionAttributeLocation, // attribute location
        2, // no of elements per attribute (vec2)
        gl.FLOAT, // data type of elements
        gl.FALSE, // is normalized?
        5 * Float32Array.BYTES_PER_ELEMENT, // size of individual vertex
        0 // offset from the beginning of a single vertex to this attribute (vec2)
    );

    gl.vertexAttribPointer(
        colorAttributeLocation, // attribute location
        3, // no of elements per attribute (vec3)
        gl.FLOAT, // data type of elements
        gl.FALSE, // is normalized?
        5 * Float32Array.BYTES_PER_ELEMENT, // size of individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // offset from the beginning of a single vertex to this attribute (vec3)
    );

    gl.enableVertexAttribArray(positionAttributeLocation); // activates the attribute
    gl.enableVertexAttribArray(colorAttributeLocation); // activates the attribute

    // Main render loop
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3); // 0 = no of elements to skip, 3 = no of vertices to draw

};

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