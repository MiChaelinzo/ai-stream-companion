import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Sparkle, Waveform } from "@phosphor-icons/react";
import { PhonemeSequencer, MouthShape, Phoneme } from "@/lib/phoneme-analyzer";
import { AvatarSkin, getSkinStyle } from "@/lib/avatar-skins";

interface VTuberAvatarProps {
  personality: {
    name: string;
    responseStyle?: string;
    tonePreset?: string;
  };
  isLive?: boolean;
  isSpeaking?: boolean;
  emotion?: "neutral" | "happy" | "excited" | "thinking" | "confused";
  speechText?: string;
  skin?: AvatarSkin;
}

export function VTuberAvatar({ 
  personality, 
  isLive = false, 
  isSpeaking = false,
  emotion = "neutral",
  speechText = "",
  skin = "default"
}: VTuberAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    head: THREE.Mesh;
    leftEye: THREE.Mesh;
    rightEye: THREE.Mesh;
    mouth: THREE.Mesh;
    body: THREE.Mesh;
    leftEar: THREE.Mesh;
    rightEar: THREE.Mesh;
    hair: THREE.Mesh[];
    accessories: THREE.Mesh[];
  } | null>(null);
  
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const [isVisible, setIsVisible] = useState(true);
  const [currentPhoneme, setCurrentPhoneme] = useState<Phoneme>('silence');
  const [currentMouthShape, setCurrentMouthShape] = useState<MouthShape>({
    openness: 0,
    width: 1,
    height: 0,
    roundness: 0.3,
    tension: 0.1
  });
  const phonemeSequencerRef = useRef<PhonemeSequencer | null>(null);

  useEffect(() => {
    if (isSpeaking && speechText) {
      phonemeSequencerRef.current?.stop();
      
      const sequencer = new PhonemeSequencer(speechText, (shape, phoneme) => {
        setCurrentMouthShape(shape);
        setCurrentPhoneme(phoneme);
      });
      
      phonemeSequencerRef.current = sequencer;
      sequencer.start();
    } else {
      phonemeSequencerRef.current?.stop();
      setCurrentPhoneme('silence');
      setCurrentMouthShape({
        openness: 0,
        width: 1,
        height: 0,
        roundness: 0.3,
        tension: 0.1
      });
    }

    return () => {
      phonemeSequencerRef.current?.stop();
    };
  }, [isSpeaking, speechText]);

  useEffect(() => {
    if (!containerRef.current) return;

    const skinStyle = getSkinStyle(skin);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const frontLight = new THREE.DirectionalLight(skinStyle.colors.eyes, 0.8);
    frontLight.position.set(0, 2, 5);
    scene.add(frontLight);

    const rimLight = new THREE.DirectionalLight(skinStyle.colors.hair, 0.5);
    rimLight.position.set(-3, 1, -2);
    scene.add(rimLight);

    const headGeometry = new THREE.SphereGeometry(1, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ 
      color: skinStyle.colors.skin,
      roughness: skinStyle.roughness,
      metalness: skinStyle.metalness
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.scale.set(1, 1.1, 0.95);
    head.position.y = 1.5;
    scene.add(head);

    const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ 
      color: skinStyle.colors.eyes,
      emissive: skinStyle.colors.eyesEmissive,
      emissiveIntensity: skinStyle.emissiveIntensity,
      roughness: skinStyle.roughness * 0.5,
      metalness: skinStyle.metalness * 1.5
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.3, 1.6, 0.75);
    scene.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial.clone());
    rightEye.position.set(0.3, 1.6, 0.75);
    scene.add(rightEye);

    const pupilGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const pupilMaterial = new THREE.MeshStandardMaterial({ 
      color: skinStyle.colors.pupils,
      roughness: skinStyle.roughness * 0.3,
      metalness: skinStyle.metalness * 2
    });
    
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(0, 0, 0.1);
    leftEye.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial.clone());
    rightPupil.position.set(0, 0, 0.1);
    rightEye.add(rightPupil);

    const mouthGeometry = new THREE.TorusGeometry(0.2, 0.05, 8, 16, Math.PI);
    const mouthMaterial = new THREE.MeshStandardMaterial({ 
      color: skinStyle.colors.mouth,
      roughness: skinStyle.roughness * 1.1
    });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, 1.2, 0.85);
    mouth.rotation.x = Math.PI;
    scene.add(mouth);

    const bodyGeometry = new THREE.CylinderGeometry(0.7, 0.9, 1.8, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: skinStyle.colors.body,
      roughness: skinStyle.roughness,
      metalness: skinStyle.metalness
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = -0.2;
    scene.add(body);

    const earGeometry = new THREE.ConeGeometry(0.25, 0.6, 8);
    const earMaterial = new THREE.MeshStandardMaterial({ 
      color: skinStyle.colors.ears,
      roughness: skinStyle.roughness,
      metalness: skinStyle.metalness
    });
    
    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(-0.8, 2.2, 0);
    leftEar.rotation.z = -Math.PI / 6;
    scene.add(leftEar);

    const rightEar = new THREE.Mesh(earGeometry, earMaterial.clone());
    rightEar.position.set(0.8, 2.2, 0);
    rightEar.rotation.z = Math.PI / 6;
    scene.add(rightEar);

    const hair: THREE.Mesh[] = [];
    const hairMaterial = new THREE.MeshStandardMaterial({ 
      color: skinStyle.colors.hair,
      roughness: skinStyle.roughness * 1.2,
      metalness: skinStyle.metalness * 0.8
    });

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const hairStrand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.05, 1.2, 8),
        hairMaterial.clone()
      );
      hairStrand.position.set(
        Math.cos(angle) * 0.9,
        2.2,
        Math.sin(angle) * 0.8
      );
      hairStrand.rotation.x = Math.PI / 8;
      hairStrand.rotation.z = angle;
      scene.add(hairStrand);
      hair.push(hairStrand);
    }

    const accessories: THREE.Mesh[] = [];
    
    const headphoneBandGeometry = new THREE.TorusGeometry(1.15, 0.08, 8, 32, Math.PI);
    const headphoneMaterial = new THREE.MeshStandardMaterial({ 
      color: skinStyle.colors.accessories,
      roughness: skinStyle.roughness * 0.6,
      metalness: skinStyle.metalness * 1.5,
      emissive: skinStyle.colors.accessoriesEmissive,
      emissiveIntensity: skinStyle.emissiveIntensity * 0.7
    });
    const headphoneBand = new THREE.Mesh(headphoneBandGeometry, headphoneMaterial);
    headphoneBand.position.set(0, 2, 0);
    headphoneBand.rotation.x = Math.PI / 2;
    scene.add(headphoneBand);
    accessories.push(headphoneBand);

    const speakerGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const leftSpeaker = new THREE.Mesh(speakerGeometry, headphoneMaterial.clone());
    leftSpeaker.position.set(-1.15, 1.6, 0);
    leftSpeaker.rotation.z = Math.PI / 2;
    scene.add(leftSpeaker);
    accessories.push(leftSpeaker);

    const rightSpeaker = new THREE.Mesh(speakerGeometry, headphoneMaterial.clone());
    rightSpeaker.position.set(1.15, 1.6, 0);
    rightSpeaker.rotation.z = Math.PI / 2;
    scene.add(rightSpeaker);
    accessories.push(rightSpeaker);

    camera.position.z = 5;
    camera.position.y = 1;

    sceneRef.current = {
      scene,
      camera,
      renderer,
      head,
      leftEye,
      rightEye,
      mouth,
      body,
      leftEar,
      rightEar,
      hair,
      accessories
    };

    const animate = () => {
      timeRef.current += 0.016;
      const time = timeRef.current;

      const breathIntensity = Math.sin(time * 1.5) * 0.03;
      body.scale.y = 1 + breathIntensity;
      body.position.y = -0.2 + breathIntensity * 0.5;

      const headSway = Math.sin(time * 0.8) * 0.1;
      const headBob = Math.sin(time * 1.2) * 0.05;
      head.rotation.y = headSway;
      head.rotation.z = Math.sin(time * 0.6) * 0.05;
      head.position.y = 1.5 + headBob;

      leftEye.position.y = 1.6 + headBob;
      rightEye.position.y = 1.6 + headBob;

      const blinkCycle = Math.sin(time * 3) > 0.95;
      leftEye.scale.y = blinkCycle ? 0.1 : 1;
      rightEye.scale.y = blinkCycle ? 0.1 : 1;

      leftEar.rotation.x = Math.sin(time * 2) * 0.15;
      rightEar.rotation.x = Math.sin(time * 2 + Math.PI) * 0.15;

      hair.forEach((strand, i) => {
        const offset = i * 0.3;
        strand.rotation.x = Math.PI / 8 + Math.sin(time * 1.5 + offset) * 0.1;
      });

      if (isSpeaking) {
        const mouthScale = {
          x: currentMouthShape.width,
          y: currentMouthShape.height * (1 + currentMouthShape.tension * 0.3),
          z: 1
        };
        
        mouth.scale.set(mouthScale.x, mouthScale.y, mouthScale.z);
        
        const baseRotation = Math.PI;
        const openRotation = currentMouthShape.openness * 0.3;
        mouth.rotation.x = baseRotation + openRotation;
        
        const roundnessOffset = (1 - currentMouthShape.roundness) * 0.1;
        mouth.position.set(0, 1.2 - currentMouthShape.openness * 0.05, 0.85 + roundnessOffset);
        
        accessories.forEach((accessory) => {
          if (accessory.geometry.type === 'CylinderGeometry') {
            const baseIntensity = 0.2;
            const speakingBoost = currentMouthShape.tension * 0.4;
            (accessory.material as THREE.MeshStandardMaterial).emissiveIntensity = baseIntensity + speakingBoost;
          }
        });
      } else {
        mouth.scale.set(1, 1, 1);
        mouth.position.set(0, 1.2, 0.85);
        
        accessories.forEach((accessory) => {
          if (accessory.geometry.type === 'CylinderGeometry') {
            (accessory.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.2;
          }
        });
      }

      switch (emotion) {
        case "happy":
          mouth.rotation.x = Math.PI * 1.1;
          mouth.scale.y = 1.3;
          leftEye.scale.set(1.2, 0.8, 1);
          rightEye.scale.set(1.2, 0.8, 1);
          break;
        case "excited":
          mouth.rotation.x = Math.PI * 1.15;
          mouth.scale.set(1.3, 1.4, 1);
          leftEye.scale.set(1.4, 1.4, 1);
          rightEye.scale.set(1.4, 1.4, 1);
          (leftEye.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6;
          (rightEye.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6;
          break;
        case "thinking":
          head.rotation.x = -0.1;
          leftEye.position.x = -0.35;
          rightEye.position.x = 0.25;
          mouth.scale.set(0.8, 0.8, 1);
          break;
        case "confused":
          head.rotation.z = Math.sin(time * 2) * 0.15;
          mouth.rotation.x = Math.PI;
          mouth.scale.set(0.7, 0.7, 1);
          leftEye.scale.set(0.9, 1.2, 1);
          rightEye.scale.set(1.1, 0.9, 1);
          break;
        default:
          leftEye.scale.set(1, 1, 1);
          rightEye.scale.set(1, 1, 1);
          (leftEye.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3;
          (rightEye.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3;
      }

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [emotion, isSpeaking, currentMouthShape, skin]);

  const getEmotionColor = () => {
    switch (emotion) {
      case "happy": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "excited": return "bg-pink-500/20 text-pink-500 border-pink-500/30";
      case "thinking": return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      case "confused": return "bg-purple-500/20 text-purple-500 border-purple-500/30";
      default: return "bg-muted/50 text-muted-foreground border-muted";
    }
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-card to-primary/10 border-primary/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.65_0.25_300_/_0.05),transparent_70%)]" />
      
      <div className="relative p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkle size={16} weight="fill" className="text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{personality.name}</h3>
              <p className="text-xs text-muted-foreground capitalize">
                {personality.tonePreset || personality.responseStyle || "neutral"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isLive && (
              <Badge className="bg-accent/20 text-accent border-accent/30">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mr-1.5 animate-pulse" />
                Live
              </Badge>
            )}
            <Badge className={getEmotionColor()}>
              {emotion}
            </Badge>
          </div>
        </div>

        <motion.div
          ref={containerRef}
          className="w-full h-64 rounded-lg bg-gradient-to-b from-background/50 to-primary/5 border border-primary/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5 }}
        />

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>Model Active</span>
          </div>
          {isSpeaking && (
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex gap-0.5">
                <motion.div
                  className="w-1 bg-accent rounded-full"
                  animate={{ height: [4, 12, 4] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                />
                <motion.div
                  className="w-1 bg-accent rounded-full"
                  animate={{ height: [4, 12, 4] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                />
                <motion.div
                  className="w-1 bg-accent rounded-full"
                  animate={{ height: [4, 12, 4] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                />
              </div>
              <div className="flex items-center gap-1 text-accent">
                <Waveform size={14} weight="bold" />
                <span className="uppercase tracking-wider font-medium">{currentPhoneme}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  );
}
