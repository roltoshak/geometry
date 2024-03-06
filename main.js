import * as THREE from 'three';
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {create_line} from './create_objects.js'

function init(){
    const canvas = document.getElementById('main');

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    scene.add(camera);

    const rend = new THREE.WebGLRenderer({canvas});
    rend.setSize(window.innerWidth, window.innerHeight);
    rend.outputColorSpace = THREE.SRGBColorSpace;
    rend.shadowMap.enabled = true;

    const raycast = new THREE.Raycaster();
    raycast.params.Points.threshold = 0.08;
    raycast.params.Line.threshold = 0.08;
    const pointer = new THREE.Vector2();
    let last;

    const alight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(alight);
    
    function random_coord(){return Math.random() * 3 - Math.random() * 3}
    
    const controls = new OrbitControls(camera, canvas);
    controls.update();

    function create_random_points(n){
        for (let i = 0; i < n; i++){
            const points = [
                new THREE.Vector3(random_coord(), random_coord(), random_coord())
            ];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.PointsMaterial({color:0x00ff00, size:0.1});
            const points_ = new THREE.Points(geometry, material);
            points_.lineID = []
            scene.add(points_);
        }
    }

    create_random_points(10);

    window.addEventListener('mousedown', () =>{
        raycast.setFromCamera(pointer, camera);
        const intersects = raycast.intersectObjects(scene.children);
        if (intersects.length){
            if (intersects[0].object.isPoints){
                const line = create_line(intersects[0].object)
                if (line) scene.add(line)
            }
        }
    })

    window.addEventListener('mousemove', (event)=>{
        const size = canvas.getBoundingClientRect();
        pointer.x = ((event.clientX - size.left) / window.innerWidth) * 2 - 1;
        pointer.y = ((event.clientY - size.top) / window.innerHeight) * -2 + 1;
    })

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        rend.setSize(window.innerWidth, window.innerHeight);
    })

    function renderer(){
        raycast.setFromCamera(pointer, camera);
        const intersects = raycast.intersectObjects(scene.children);
        if (last) last.material.size = 0.1;
        if (intersects.length){
            console.log(intersects[0])
            intersects[0].object.material.size = 0.5;
            last = intersects[0].object
        }

        requestAnimationFrame(renderer);
        controls.update();
        rend.render(scene, camera);
    }

    renderer();
}

init();