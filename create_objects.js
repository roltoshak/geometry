import * as THREE from 'three';

let point, point_num = 0
function create_line(object){
    point_num += 1
    if (point_num == 1){
        console.log("f")
        console.log(object)
        point = object
        object.material.color.setHex(0xff0000)

        return
    }
    point.material.color.setHex(0x00ff00)
    console.log("s")
    point_num = 0
    const points = []
    points.push(new THREE.Vector3(
        point.geometry.attributes.position.array[0],
        point.geometry.attributes.position.array[1],
        point.geometry.attributes.position.array[2]
    ))
    points.push(new THREE.Vector3(
        object.geometry.attributes.position.array[0],
        object.geometry.attributes.position.array[1],
        object.geometry.attributes.position.array[2]
    ))
    const geom = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({color:0xff0000});
    const line = new THREE.LineSegments(geom, material);
    point.lineID.push([line.id, 0])
    object.lineID.push([line.id, 1])

    return line
}

export { create_line }