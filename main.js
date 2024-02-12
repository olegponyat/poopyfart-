var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Body = Matter.Body;

// create an engine
var engine = Engine.create({
    gravity: { x: 0, y: 0.1  } // Set gravity in the y-direction
});

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false // Set to true for wireframe view
    }
});

var sphere = Bodies.circle(window.innerWidth / 2, window.innerHeight / 2, 20, {
    restitution: 1,
    friction: 0,
    density: 0.002,
    render: {
        fillStyle: 'blue',
        image: 'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
    }
});
var box = Bodies.rectangle(1000, 500, 100, 100, {
    density: 0.005,
    friction: 1
})
var ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight +39, window.innerWidth, 80, {
    isStatic: true,
    render: {
        fillStyle: 'green' // Rectangle color
    }
});

const objects = [sphere, ground]
function randomNumberWidth(){
    return (Math.random() * window.innerWidth)/2
}
function randomPlatform(){
    return (Math.random() * 10).toFixed(0)
}
for( let i=1;i <= randomPlatform(); i++){
    console.log('chat')
    let platform = Bodies.rectangle(randomNumberWidth(),(-i * 200) + 900, 200, 20, {
        isStatic: true,
        render: {
            fillStyle: 'orange'
        }
    })
    objects.push(platform)
}
var platform1 = Bodies.rectangle(randomNumberWidth(), 400, randomNumberWidth()/2, 20, {
    isStatic: true,
    render: {
        fillStyle: 'orange'
    }
});

var platform2 = Bodies.rectangle(randomNumberWidth(), 200, randomNumberWidth()/2 , 20, {
    isStatic: true,
    render: {
        fillStyle: 'orange'
    }
});

var platform3 = Bodies.rectangle(randomNumberWidth(), 600, randomNumberWidth()/2, 20, {
    isStatic: true,
    render: {
        fillStyle: 'orange'
    }
});
console.log(objects)
  Composite.add(engine.world, objects);
  
  Render.run(render);
  
  var runner = Runner.create();
  
  Runner.run(runner, engine);
  
  // Apply force to move the sphere
  var forceMagnitude = 0.002;
  var jumpImpulse = -0.055; // Adjust jump impulse as needed
  var damping = 0.00007; // Adjust damping factor as needed
  
  // Track keys pressed
  var keysPressed = { up: false, down: false, left: false, right: false, x: false};
  
  // Flag to track if the sphere is in the air
  var isJumping = false;
  
  // Flag to check if the sphere can jump
  let canJump = false;
  
  // Continuous force application
  function applyForces() {
      // Apply horizontal movement force
      Body.applyForce(sphere, sphere.position, { x: forceMagnitude * (keysPressed.right - keysPressed.left), y: 0 });
  
      // Apply damping forces for more realistic movement
      Body.applyForce(sphere, sphere.position, { x: -sphere.velocity.x * damping, y: 0.00001 });
  
      requestAnimationFrame(applyForces);
  }

  // Continuous jump animation
  function jump() {
      if (keysPressed.up && canJump) {
          Body.applyForce(sphere, sphere.position, { x: 0, y: jumpImpulse });
          canJump = false;
      }
      requestAnimationFrame(jump);
    }
    function slam() {
        if (keysPressed.down) {
            jumpImpulse = -0.05; // Adjust the bounce impulse when holding down the down arrow key
            sphere.restitution = 1;
            Body.applyForce(sphere, sphere.position, { x: 0, y: 0.001 });
        } else {

            sphere.restitution = 0.8;
        }
        requestAnimationFrame(slam);
    }
    function density() {
        if(keysPressed.x === true){
            sphere.restitution = .1
            sphere.density = 1
            sphere.render.strokeStyle = 'white';
            sphere.render.lineWidth = 5; // Adjust the width of the outline as needed
            var hitForceMagnitude = 0.01;
            Body.applyForce(sphere, sphere.position, { x: hitForceMagnitude * (keysPressed.right - keysPressed.left), y: 0 });
        }else if (keysPressed.x === false){  
            sphere.restitution = .8
            sphere.density = 0.002
            sphere.render.strokeStyle = null;
            sphere.render.lineWidth = 0; // Set the width to 0 to remove the outline

        }
        requestAnimationFrame(density)
    }

    // Check for collisions with the ground
    function checkGroundCollision() {
        const collisions = Matter.Query.collides(sphere, [ground, platform1, platform2, platform3]);
        if (collisions.length > 0 && !keysPressed.up) {
            canJump = true;
        }

        requestAnimationFrame(checkGroundCollision);
      }
      
      // Start applying forces, jump animation, and ground collision check
      applyForces();
      jump();
      slam();
      density();
      checkGroundCollision();
      
      document.addEventListener("keydown", function (e) {
          if (e.key === 'ArrowLeft') keysPressed.left = true;
          if (e.key === 'ArrowRight') keysPressed.right = true;
          if (e.key === 'ArrowUp') keysPressed.up = true;
          if (e.key === 'ArrowDown') keysPressed.down = true;
          if (e.key === 'x') keysPressed.x = true
      });
      
      document.addEventListener("keyup", function (e) {
          if (e.key === 'ArrowLeft') keysPressed.left = false;
          if (e.key === 'ArrowRight') keysPressed.right = false;
          if (e.key === 'ArrowUp') keysPressed.up = false;
          if (e.key === 'ArrowDown') keysPressed.down = false;
          if (e.key === 'x') keysPressed.x = false;
      });    