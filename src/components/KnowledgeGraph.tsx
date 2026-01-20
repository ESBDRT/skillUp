import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Calendar, RotateCcw, ExternalLink, ZoomIn, ZoomOut, Maximize2, Minimize2, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface MemoryConcept {
  id: string;
  course_id: string;
  course_title: string | null;
  concept_title: string;
  concept_content: string | null;
  memory_strength: number | null;
  next_review_at: string | null;
  repetitions: number | null;
  interval_days: number | null;
}

interface GraphNode {
  id: string;
  name: string;
  courseId: string;
  courseTitle: string;
  memoryStrength: number;
  content: string;
  nextReview: string | null;
  repetitions: number;
  radius: number;
  color: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  index?: number;
}

interface GraphLink {
  source: GraphNode | string;
  target: GraphNode | string;
  type: 'course' | 'semantic';
  index?: number;
}

interface KnowledgeGraphProps {
  concepts: MemoryConcept[];
  onConceptClick?: (concept: MemoryConcept) => void;
  filter?: 'all' | 'danger' | 'warning' | 'solid';
  selectedCourseId?: string;
}

// Color helper based on memory strength
const getStrengthColor = (strength: number): string => {
  if (strength < 40) return 'hsl(0, 70%, 55%)';
  if (strength < 70) return 'hsl(35, 85%, 55%)';
  return 'hsl(142, 60%, 45%)';
};

const getStrengthLabel = (strength: number): string => {
  if (strength < 40) return 'En danger';
  if (strength < 70) return 'À revoir';
  return 'Solide';
};

// Extract keywords from text for semantic linking
const extractKeywords = (text: string): Set<string> => {
  const stopWords = new Set(['le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'à', 'en', 'est', 'sont', 'pour', 'par', 'dans', 'sur', 'avec', 'ce', 'cette', 'ces', 'qui', 'que', 'the', 'a', 'an', 'and', 'or', 'is', 'are', 'for', 'by', 'in', 'on', 'with', 'this', 'that', 'which']);
  
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word))
  );
};

const hasCommonKeywords = (concept1: MemoryConcept, concept2: MemoryConcept, minCommon: number = 2): boolean => {
  const text1 = `${concept1.concept_title} ${concept1.concept_content || ''}`;
  const text2 = `${concept2.concept_title} ${concept2.concept_content || ''}`;
  
  const keywords1 = extractKeywords(text1);
  const keywords2 = extractKeywords(text2);
  
  let commonCount = 0;
  for (const word of keywords1) {
    if (keywords2.has(word)) commonCount++;
    if (commonCount >= minCommon) return true;
  }
  
  return false;
};

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
  concepts,
  filter = 'all',
  selectedCourseId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 300 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; distance?: number } | null>(null);
  const simulationRef = useRef<ReturnType<typeof forceSimulation<GraphNode>> | null>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);
  const navigate = useNavigate();

  // Filter concepts
  const filteredConcepts = useMemo(() => {
    let result = concepts;
    
    if (selectedCourseId) {
      result = result.filter(c => c.course_id === selectedCourseId);
    }
    
    if (filter !== 'all') {
      result = result.filter(c => {
        const strength = c.memory_strength ?? 50;
        if (filter === 'danger') return strength < 40;
        if (filter === 'warning') return strength >= 40 && strength < 70;
        if (filter === 'solid') return strength >= 70;
        return true;
      });
    }
    
    return result;
  }, [concepts, filter, selectedCourseId]);

  // Generate graph data
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = filteredConcepts.map(concept => ({
      id: concept.id,
      name: concept.concept_title,
      courseId: concept.course_id,
      courseTitle: concept.course_title || 'Cours inconnu',
      memoryStrength: concept.memory_strength ?? 50,
      content: concept.concept_content || '',
      nextReview: concept.next_review_at,
      repetitions: concept.repetitions ?? 0,
      radius: Math.max(12, 8 + (concept.repetitions ?? 0) * 2),
      color: getStrengthColor(concept.memory_strength ?? 50),
    }));

    const links: GraphLink[] = [];
    
    const courseGroups: Record<string, MemoryConcept[]> = {};
    filteredConcepts.forEach(concept => {
      if (!courseGroups[concept.course_id]) {
        courseGroups[concept.course_id] = [];
      }
      courseGroups[concept.course_id].push(concept);
    });

    Object.values(courseGroups).forEach(courseConcepts => {
      for (let i = 0; i < courseConcepts.length - 1; i++) {
        const sourceNode = nodes.find(n => n.id === courseConcepts[i].id);
        const targetNode = nodes.find(n => n.id === courseConcepts[i + 1].id);
        if (sourceNode && targetNode) {
          links.push({ source: sourceNode, target: targetNode, type: 'course' });
        }
      }
    });

    for (let i = 0; i < filteredConcepts.length; i++) {
      for (let j = i + 1; j < filteredConcepts.length; j++) {
        if (filteredConcepts[i].course_id === filteredConcepts[j].course_id) continue;
        
        if (hasCommonKeywords(filteredConcepts[i], filteredConcepts[j])) {
          const sourceNode = nodes.find(n => n.id === filteredConcepts[i].id);
          const targetNode = nodes.find(n => n.id === filteredConcepts[j].id);
          if (sourceNode && targetNode) {
            links.push({ source: sourceNode, target: targetNode, type: 'semantic' });
          }
        }
      }
    }

    return { nodes, links };
  }, [filteredConcepts]);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width || 800,
          height: isFullscreen ? window.innerHeight - 100 : Math.min(350, window.innerHeight - 400),
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isFullscreen]);

  // Initialize simulation
  useEffect(() => {
    if (graphData.nodes.length === 0) return;

    nodesRef.current = graphData.nodes.map(n => ({ ...n }));
    linksRef.current = graphData.links.map(l => ({
      ...l,
      source: nodesRef.current.find(n => n.id === (typeof l.source === 'string' ? l.source : l.source.id))!,
      target: nodesRef.current.find(n => n.id === (typeof l.target === 'string' ? l.target : l.target.id))!,
    }));

    const simulation = forceSimulation(nodesRef.current)
      .force('link', forceLink(linksRef.current).id((d: any) => d.id).distance(80))
      .force('charge', forceManyBody().strength(-150))
      .force('center', forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('collide', forceCollide().radius((d: any) => d.radius + 5))
      .alphaDecay(0.02);

    simulationRef.current = simulation;

    simulation.on('tick', () => {
      draw();
    });

    return () => {
      simulation.stop();
    };
  }, [graphData, dimensions]);

  // Draw function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nodes = nodesRef.current;
    const links = linksRef.current;

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    ctx.save();
    
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw links
    links.forEach(link => {
      const source = link.source as GraphNode;
      const target = link.target as GraphNode;
      
      if (source.x === undefined || source.y === undefined || 
          target.x === undefined || target.y === undefined) return;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      
      if (link.type === 'course') {
        ctx.strokeStyle = 'rgba(100, 150, 255, 0.4)';
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = 'rgba(180, 130, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
      }
      
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw nodes
    nodes.forEach(node => {
      if (node.x === undefined || node.y === undefined) return;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      
      if (selectedNode?.id === node.id) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      const fontSize = Math.max(9, 11 / zoom);
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      
      let label = node.name;
      if (ctx.measureText(label).width > 70) {
        label = label.substring(0, 10) + '...';
      }
      
      const textY = node.y + node.radius + fontSize + 2;
      
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(node.x - textWidth / 2 - 3, textY - fontSize / 2 - 2, textWidth + 6, fontSize + 4);
      
      ctx.fillStyle = 'white';
      ctx.fillText(label, node.x, textY);
    });

    ctx.restore();
  }, [dimensions, zoom, pan, selectedNode]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Get position from event (mouse or touch)
  const getEventPos = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom,
    };
  };

  const findNodeAtPosition = (x: number, y: number): GraphNode | null => {
    for (const node of nodesRef.current) {
      if (node.x === undefined || node.y === undefined) continue;
      const dx = x - node.x;
      const dy = y - node.y;
      if (Math.sqrt(dx * dx + dy * dy) <= node.radius) {
        return node;
      }
    }
    return null;
  };

  // Mouse handlers
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getEventPos(e.clientX, e.clientY);
    const node = findNodeAtPosition(pos.x, pos.y);
    setSelectedNode(node);
    draw();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getEventPos(e.clientX, e.clientY);
    const node = findNodeAtPosition(pos.x, pos.y);
    
    if (!node) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.min(4, Math.max(0.3, z * delta)));
  };

  // Touch handlers for mobile
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0] as React.Touch;
      const pos = getEventPos(touch.clientX, touch.clientY);
      const node = findNodeAtPosition(pos.x, pos.y);
      
      if (node) {
        setSelectedNode(node);
      } else {
        setTouchStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
      }
    } else if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches);
      setTouchStart({ x: 0, y: 0, distance });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    if (e.touches.length === 1 && touchStart && !touchStart.distance) {
      const touch = e.touches[0];
      setPan({
        x: touch.clientX - touchStart.x,
        y: touch.clientY - touchStart.y,
      });
    } else if (e.touches.length === 2 && touchStart?.distance) {
      const newDistance = getTouchDistance(e.touches);
      const scale = newDistance / touchStart.distance;
      setZoom(z => Math.min(4, Math.max(0.3, z * scale)));
      setTouchStart({ x: 0, y: 0, distance: newDistance });
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const handleZoomIn = () => setZoom(z => Math.min(4, z * 1.2));
  const handleZoomOut = () => setZoom(z => Math.max(0.3, z / 1.2));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleReviewConcept = () => {
    if (selectedNode) {
      sessionStorage.setItem('targetedConceptIds', JSON.stringify([selectedNode.id]));
      navigate('/smart-session');
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Non planifié';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `En retard de ${Math.abs(diffDays)} jour(s)`;
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Demain';
    return `Dans ${diffDays} jours`;
  };

  if (filteredConcepts.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center h-64 text-muted-foreground"
        role="status"
        aria-label="Aucun concept à afficher"
      >
        <Brain className="w-12 h-12 mb-4 opacity-50" aria-hidden="true" />
        <p>Aucun concept à afficher</p>
        <p className="text-sm">Complète des cours pour voir ton graphe</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full rounded-xl overflow-hidden bg-card/30 border border-border/50 ${
        isFullscreen ? 'fixed inset-4 z-50 bg-background' : ''
      }`}
      role="img"
      aria-label={`Graphe de connaissances avec ${nodesRef.current.length} concepts et ${linksRef.current.length} connexions`}
    >
      {/* Help text for mobile */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p className="text-xs text-muted-foreground bg-background/60 backdrop-blur-sm px-2 py-1 rounded-full opacity-70">
          <Move className="w-3 h-3 inline mr-1" aria-hidden="true" />
          Glisser pour explorer • Pincer pour zoomer
        </p>
      </div>

      {/* Legend - compact for mobile */}
      <div className="absolute top-10 left-2 z-10 flex flex-col gap-1 bg-background/80 backdrop-blur-sm rounded-lg p-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'hsl(142, 60%, 45%)' }} aria-hidden="true" />
          <span className="text-[10px] text-muted-foreground">Solide</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'hsl(35, 85%, 55%)' }} aria-hidden="true" />
          <span className="text-[10px] text-muted-foreground">À revoir</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'hsl(0, 70%, 55%)' }} aria-hidden="true" />
          <span className="text-[10px] text-muted-foreground">Danger</span>
        </div>
      </div>

      {/* Controls - positioned at bottom for thumb access */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10"
          onClick={handleZoomOut}
          aria-label="Dézoomer"
        >
          <ZoomOut className="h-5 w-5" aria-hidden="true" />
        </Button>
        <span className="text-sm font-medium text-foreground min-w-[3rem] text-center" aria-live="polite">
          {Math.round(zoom * 100)}%
        </span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10"
          onClick={handleZoomIn}
          aria-label="Zoomer"
        >
          <ZoomIn className="h-5 w-5" aria-hidden="true" />
        </Button>
        <div className="w-px h-6 bg-border" aria-hidden="true" />
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10"
          onClick={handleReset}
          aria-label="Réinitialiser la vue"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
          aria-pressed={isFullscreen}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Stats badge */}
      <div className="absolute top-10 right-2 z-10 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1">
        <p className="text-[10px] text-muted-foreground">
          {nodesRef.current.length} concepts • {linksRef.current.length} liens
        </p>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="cursor-grab active:cursor-grabbing touch-none"
        aria-label="Canvas du graphe de connaissances interactif"
      />

      {/* Selected Node Detail Modal */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 left-2 right-2 z-20"
            role="dialog"
            aria-label={`Détails du concept: ${selectedNode.name}`}
          >
            <div className="bg-background/95 backdrop-blur-md border border-border rounded-xl p-4 shadow-xl max-w-md mx-auto">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground line-clamp-2">{selectedNode.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{selectedNode.courseTitle}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => setSelectedNode(null)}
                  aria-label="Fermer les détails"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              {selectedNode.content && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {selectedNode.content}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge 
                  variant="outline"
                  style={{ borderColor: selectedNode.color, color: selectedNode.color }}
                >
                  <Brain className="w-3 h-3 mr-1" aria-hidden="true" />
                  {selectedNode.memoryStrength}% - {getStrengthLabel(selectedNode.memoryStrength)}
                </Badge>
                <Badge variant="secondary">
                  <Calendar className="w-3 h-3 mr-1" aria-hidden="true" />
                  {formatDate(selectedNode.nextReview)}
                </Badge>
                <Badge variant="secondary">
                  <RotateCcw className="w-3 h-3 mr-1" aria-hidden="true" />
                  {selectedNode.repetitions} révision(s)
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1 min-h-[44px]" 
                  size="sm"
                  onClick={handleReviewConcept}
                >
                  <ExternalLink className="w-4 h-4 mr-2" aria-hidden="true" />
                  Réviser
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="min-h-[44px]"
                  onClick={() => setSelectedNode(null)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KnowledgeGraph;
