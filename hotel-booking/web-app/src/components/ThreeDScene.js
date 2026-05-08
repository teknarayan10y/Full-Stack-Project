import React, { useEffect, useRef } from 'react';
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

const ThreeDScene = ({ onSceneLoaded }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 15;
    camera.position.y = 5;
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    
    // Clear any existing canvas
    if (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    
    mountRef.current.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.minDistance = 10;
    controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI / 2;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create a hotel building
    createHotelScene(scene);

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Update controls
      controls.update();
      
      // Render scene
      renderer.render(scene, camera);
    };

    animate();

    // Notify parent component that scene is loaded
    if (onSceneLoaded) {
      onSceneLoaded();
    }

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Dispose resources
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
      
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [onSceneLoaded]);

  // Function to create hotel scene
  const createHotelScene = (scene) => {
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4d8c57,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Hotel building
    const buildingGeometry = new THREE.BoxGeometry(10, 8, 6);
    const buildingMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xf5f5f5,
      roughness: 0.3,
      metalness: 0.2
    });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.y = 4;
    building.castShadow = true;
    building.receiveShadow = true;
    scene.add(building);

    // Hotel roof
    const roofGeometry = new THREE.ConeGeometry(7.5, 3, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0066cc,
      roughness: 0.5,
      metalness: 0.3
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 9.5;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    scene.add(roof);

    // Windows
    const createWindow = (x, y, z) => {
      const windowGeometry = new THREE.PlaneGeometry(1, 1.5);
      const windowMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4d94ff,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.7
      });
      const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
      windowMesh.position.set(x, y, z);
      windowMesh.castShadow = false;
      windowMesh.receiveShadow = false;
      return windowMesh;
    };

    // Front windows
    const frontWindowPositions = [
      [-3, 4, 3.01], [-1, 4, 3.01], [1, 4, 3.01], [3, 4, 3.01],
      [-3, 6, 3.01], [-1, 6, 3.01], [1, 6, 3.01], [3, 6, 3.01],
      [-3, 2, 3.01], [-1, 2, 3.01], [1, 2, 3.01], [3, 2, 3.01]
    ];

    frontWindowPositions.forEach(pos => {
      const windowMesh = createWindow(...pos);
      scene.add(windowMesh);
    });

    // Door
    const doorGeometry = new THREE.PlaneGeometry(2, 3);
    const doorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B4513,
      roughness: 0.5,
      metalness: 0.2
    });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 1.5, 3.01);
    scene.add(door);

    // Swimming pool
    const poolGeometry = new THREE.BoxGeometry(6, 0.5, 4);
    const poolMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4d94ff,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.8
    });
    const pool = new THREE.Mesh(poolGeometry, poolMaterial);
    pool.position.set(-8, 0.25, 0);
    scene.add(pool);

    // Palm trees
    const createPalmTree = (x, z) => {
      // Trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 3, 8);
      const trunkMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513,
        roughness: 0.8,
        metalness: 0.2
      });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.set(x, 1.5, z);
      trunk.castShadow = true;
      scene.add(trunk);

      // Leaves
      const leavesGeometry = new THREE.SphereGeometry(1, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
      const leavesMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2e8b57,
        roughness: 0.8,
        metalness: 0.2
      });
      const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
      leaves.position.set(x, 3, z);
      leaves.scale.set(1, 0.5, 1);
      leaves.castShadow = true;
      scene.add(leaves);
    };

    // Add palm trees
    createPalmTree(8, 8);
    createPalmTree(-8, 8);
    createPalmTree(8, -8);
    createPalmTree(-8, -8);
    createPalmTree(0, 8);
    createPalmTree(0, -8);

    // Add some clouds
    const createCloud = (x, y, z) => {
      const cloudGroup = new THREE.Group();
      
      const createCloudPart = (x, y, z, scale) => {
        const cloudGeometry = new THREE.SphereGeometry(1, 8, 8);
        const cloudMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xffffff,
          roughness: 0.9,
          metalness: 0.1
        });
        const cloudPart = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloudPart.position.set(x, y, z);
        cloudPart.scale.set(scale, scale * 0.6, scale);
        cloudGroup.add(cloudPart);
      };
      
      createCloudPart(0, 0, 0, 1);
      createCloudPart(1, 0, 0, 0.8);
      createCloudPart(-1, 0, 0, 0.8);
      createCloudPart(0, 0, 1, 0.8);
      createCloudPart(0, 0, -1, 0.8);
      
      cloudGroup.position.set(x, y, z);
      scene.add(cloudGroup);
      
      return cloudGroup;
    };
    
    const clouds = [
      createCloud(15, 15, 15),
      createCloud(-15, 18, -15),
      createCloud(10, 17, -10)
    ];
    
    // Animate clouds
    const animateClouds = () => {
      clouds.forEach((cloud, index) => {
        const speed = 0.01 + (index * 0.005);
        cloud.position.x += speed;
        
        if (cloud.position.x > 30) {
          cloud.position.x = -30;
        }
      });
      
      requestAnimationFrame(animateClouds);
    };
    
    animateClouds();
  };

  return <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />;
};

export default ThreeDScene;
