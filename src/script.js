import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
*/
const gltfLoader = new GLTFLoader()

const dracoLoader = new DRACOLoader()

dracoLoader.setDecoderPath('/draco/')

gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

// // Fox
// gltfLoader.load(
//     '/models/Fox/glTF/Fox.gltf',
//     (fox) => {
//         console.log('success')
//         console.log(fox)

//         mixer = new THREE.AnimationMixer(fox.scene)
//         // const action = mixer.clipAction(fox.animations[0])
//         // const action = mixer.clipAction(fox.animations[1])
//         const action = mixer.clipAction(fox.animations[2])

//         action.play()

//         fox.scene.scale.set(0.025, 0.025, 0.025)
//         scene.add(fox.scene)

//     },
//     (progress) => {
//         console.log('progress')
//         console.log(progress)
//     },
//     (error) => {
//         console.log('error')
//         console.log(error)
//     }
// )
let cybertruck
// Cybertruck
gltfLoader.load(
    '/models/cybertruck.glb',
    (glb) => {
        cybertruck = glb.scene
        console.log('cybertruck success')
        console.log('cybertruck: ', cybertruck)


        cybertruck.position.set(0,0,0)
        cybertruck.rotation.set(0,Math.PI/2,0)

        scene.add(cybertruck)
        
    },
    (progress) => {
        console.log('cybertruck progress')
        console.log(progress)
    },
    (error) => {
        console.log('cybertruck error')
        console.log(error)
    }
)


// Benz
// // gltfLoader.load(
// //     '/models/Mercedes_Benz_300_SL_roadster.glb',
// //     (benz) => {
// //         console.log('benz success')
// //         console.log('benz: ', benz)

// //         // mixer = new THREE.AnimationMixer(benz.scene)
// //         // const action = mixer.clipAction(benz.animations[0])
// //         // const action = mixer.clipAction(benz.animations[1])
// //         // action.play()

// //         benz.scene.scale.set(0.00025, 0.00025, 0.00025)


// //         benz.scene.position.set(5,5,5)
// //         // benz.scene.rotation.set(0,Math.PI/2,0)
// //         scene.add(benz.scene)
        
// //     },
// //     (progress) => {
// //         console.log('benz progress')
// //         console.log(progress)
// //     },
// //     (error) => {
// //         console.log('benz error')
// //         console.log(error)
// //     }
// // )

/**
 * Floor
*/
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 10),
    new THREE.MeshStandardMaterial({
        color: '#DBE9FA',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
floor.position.set(-45,0,0)
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
// scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(20, 20, 20)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

// Move CyberTruck
// Set up keyboard controls
const moveSpeed = 0.1;
const keys = {
    left: false,
    right: false,
    up: false,
    down: false
};

// Event listeners for keydown and keyup events
document.addEventListener('keydown', (event) => {
    console.log('keydown')
    handleKeyDown(event);
});

document.addEventListener('keyup', (event) => {
    console.log('keyup')
    handleKeyUp(event);
});

// Function to handle key down events
function handleKeyDown(event) {
    console.log('handleKeyDown - event.key: ', event.key)
    if (event.key === 'ArrowLeft') {
        keys.left = true;
    } else if (event.key === 'ArrowRight') {
        keys.right = true;
    } else if (event.key === 'ArrowUp') {
        keys.up = true;
    } else if (event.key === 'ArrowDown') {
        keys.down = true;
    }
}

// Function to handle key up events
function handleKeyUp(event) {
    console.log('handleKeyUp - event.key: ', event.key)
    if (event.key === 'ArrowLeft') {
        keys.left = false;
    } else if (event.key === 'ArrowRight') {
        keys.right = false;
    } else if (event.key === 'ArrowUp') {
        keys.up = false;
    } else if (event.key === 'ArrowDown') {
        keys.down = false;
    }
}

// Update function to move the cube based on keyboard input
function update() {
    if (keys.left && keys.up) {
        cybertruck.position.z += moveSpeed;

        cybertruck.position.x -= (moveSpeed * 5) // move forward faster
    }
    if (keys.right && keys.up) {
        cybertruck.position.z -= moveSpeed;

        cybertruck.position.x -= (moveSpeed * 5); // move forward faster
    }
    if (keys.up) {
        cybertruck.position.x -= moveSpeed;
        console.log('update - cybertruck.position.x: ', cybertruck.position.x, ' moveSpeed: ', moveSpeed)
    }
    if (keys.down) {
        cybertruck.position.x += moveSpeed;
    }
}


const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer
    mixer !== null ? mixer.update(deltaTime) : mixer = null

    // Update controls
    controls.update()

    // Update Car
    try {
        update()
    } catch(error) {
        console.error(error)
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()