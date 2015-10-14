//From https://github.com/EvanHahn/ScriptInclude
include = function() {
    function f() {
        var a = this.readyState;
        (!a || /ded|te/.test(a)) && (c--, !c && e && d())
    }
    var a = arguments,
        b = document,
        c = a.length,
        d = a[c - 1],
        e = d.call;
    e && c--;
    for (var g, h = 0; c > h; h++) g = b.createElement("script"), g.src = arguments[h], g.async = !0, g.onload = g.onerror = g.onreadystatechange = f, (b.head || b.getElementsByTagName("head")[0]).appendChild(g)
};
serialInclude = function(a) {
    var b = console,
        c = serialInclude.l;
    if (a.length > 0) c.splice(0, 0, a);
    else b.log("Done!");
    if (c.length > 0) {
        if (c[0].length > 1) {
            var d = c[0].splice(0, 1);
            b.log("Loading " + d + "...");
            include(d, function() {
                serialInclude([]);
            });
        } else {
            var e = c[0][0];
            c.splice(0, 1);
            e.call();
        };
    } else b.log("Finished.");
};
serialInclude.l = new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function(m, key, value) {
            vars[decodeURIComponent(key)] = decodeURIComponent(value);
        });
    return vars;
}

serialInclude(['../lib/CGF.js', 'XMLscene.js', 'MySceneGraph.js', 'Initials.js', 'Frustum.js', 'Lights.js',
    'Materials.js', 'Triangle.js', 'Rectangle.js', 'Transformations.js', 'FuncAux.js', 'Leaves.js', 'Sphere.js', 'Frame.js', 'Cube.js', 'Cylinder.js',
    'Node.js', 'MyInterface.js',

    main = function() {
        // Standard application, scene and interface setup
        var app = new CGFapplication(document.body);
        var myScene = new XMLscene();
        var myInterface = new MyInterface();
        app.setInterface(myInterface);
        app.init();

        app.setScene(myScene);


        myInterface.setActiveCamera(myScene.camera);

        // get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
        // or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) 

        var filename = getUrlVars()['file'] || "demo.xml";

        // create and load graph, and associate it to scene. 
        // Check console for loading errors
        var myGraph = new MySceneGraph(filename, myScene);
        myScene.gui = myInterface;
        // start
        app.run();
    }

]);



/*
                       hhhhhhh                                 iiii                     
                       h:::::h                                i::::i                    
                       h:::::h                                 iiii                     
                       h:::::h                                                          
        cccccccccccccccch::::h hhhhh         aaaaaaaaaaaaa   iiiiiiirrrrr   rrrrrrrrr   
      cc:::::::::::::::ch::::hh:::::hhh      a::::::::::::a  i:::::ir::::rrr:::::::::r  
     c:::::::::::::::::ch::::::::::::::hh    aaaaaaaaa:::::a  i::::ir:::::::::::::::::r 
    c:::::::cccccc:::::ch:::::::hhh::::::h            a::::a  i::::irr::::::rrrrr::::::r
    c::::::c     ccccccch::::::h   h::::::h    aaaaaaa:::::a  i::::i r:::::r     r:::::r
    c:::::c             h:::::h     h:::::h  aa::::::::::::a  i::::i r:::::r     rrrrrrr
    c:::::c             h:::::h     h:::::h a::::aaaa::::::a  i::::i r:::::r            
    c::::::c     ccccccch:::::h     h:::::ha::::a    a:::::a  i::::i r:::::r            
    c:::::::cccccc:::::ch:::::h     h:::::ha::::a    a:::::a i::::::ir:::::r            
     c:::::::::::::::::ch:::::h     h:::::ha:::::aaaa::::::a i::::::ir:::::r            
      cc:::::::::::::::ch:::::h     h:::::h a::::::::::aa:::ai::::::ir:::::r            
        cccccccccccccccchhhhhhh     hhhhhhh  aaaaaaaaaa  aaaaiiiiiiiirrrrrrr   

    

//////////////////////////////
/////////////////////////////
//Legs
    this.pushMatrix();
    this.translate(2.3, 0, 4.7);
    this.scale(0.2, 1.5, 0.2);
    this.cube.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(1, 0, 4.7);
    this.scale(0.2, 1.5, 0.2);
    this.cube.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(1, 0, 5.8);
    this.scale(0.2, 1.5, 0.2);
    this.cube.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(2.3, 0, 5.8);
    this.scale(0.2, 1.5, 0.2);
    this.cube.display();
    this.popMatrix();

//cover
/////////////////////////////////////
////////////////////////////////////
    this.pushMatrix();
    this.translate(1, 1.5, 4.5);
    this.scale(1.5, 0.2, 1.5);
    this.cube.display();
    this.popMatrix();
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    //Subsituir por cilindros para dar o efeito redondos
    this.pushMatrix();
    this.translate(2.3, 1.5, 5.8);
    this.scale(0.2, 2, 0.2);
    this.cube.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(1, 1.5, 5.8);
    this.scale(0.2, 2, 0.2);
    this.cube.display();
    this.popMatrix();
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    //verticalFrame
    this.pushMatrix();
    this.translate(1, 3, 5.8);
    this.scale(1.5, 1, 0.2);
    this.cube.display();
    this.popMatrix();

    /*
    | |      | |   | |     
    | |_ __ _| |__ | | ___ 
    | __/ _` | '_ \| |/ _ \
    | || (_| | |_) | |  __/
     \__\__,_|_.__/|_|\___|
    this.pushMatrix();
    this.scale(0.25, 2, 0.25);
    this.cube.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(0, 0, 3);
    this.scale(0.25, 2, 0.25);
    this.cube.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(4, 0, 0);
    this.scale(0.25, 2, 0.25);
    this.cube.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(4, 0, 3);
    this.scale(0.25, 2, 0.25);
    this.cube.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(0, 2, 0);
    this.scale(4.5, 0.2, 3.5);
    this.cube.display();
    this.popMatrix();











*/