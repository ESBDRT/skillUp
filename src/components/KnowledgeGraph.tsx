import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Calendar, RotateCcw, ExternalLink, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
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
  if (strength < 40) return 'hsl(0, 70%, 55%)'; // Red - danger
  if (strength < 70) return 'hsl(35, 85%, 55%)'; // Orange - warning
  return 'hsl(142, 60%, 45%)'; // Green - solid
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

// Check if two concepts have common keywords
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
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
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
    
    // Group by course
    const courseGroups: Record<string, MemoryConcept[]> = {};
    filteredConcepts.forEach(concept => {
      if (!courseGroups[concept.course_id]) {
        courseGroups[concept.course_id] = [];
      }
      courseGroups[concept.course_id].push(concept);
    });

    // Create course-based links
    Object.values(courseGroups).forEach(courseConcepts => {
      for (let i = 0; i < courseConcepts.length - 1; i++) {
        const sourceNode = nodes.find(n => n.id === courseConcepts[i].id);
        const targetNode = nodes.find(n => n.id === courseConcepts[i + 1].id);
        if (sourceNode && targetNode) {
          links.push({
            source: sourceNode,
            target: targetNode,
            type: 'course',
          });
        }
      }
    });

    // Create semantic links
    for (let i = 0; i < filteredConcepts.length; i++) {
      for (let j = i + 1; j < filteredConcepts.length; j++) {
        if (filteredConcepts[i].course_id === filteredConcepts[j].course_id) continue;
        
        if (hasCommonKeywords(filteredConcepts[i], filteredConcepts[j])) {
          const sourceNode = nodes.find(n => n.id === filteredConcepts[i].id);
          const targetNode = nodes.find(n => n.id === filteredConcepts[j].id);
          if (sourceNode && targetNode) {
            links.push({
              source: sourceNode,
              target: targetNode,
              type: 'semantic',
            });
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
          height: Math.max(400, window.innerHeight - 350),
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

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
    
    // Apply zoom and pan
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

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      
      // Glow effect for selected
      if (selectedNode?.id === node.id) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Label
      const fontSize = Math.max(9, 11 / zoom);
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      
      let label = node.name;
      if (ctx.measureText(label).width > 70) {
        label = label.substring(0, 10) + '...';
      }
      
      const textY = node.y + node.radius + fontSize + 2;
      
      // Text background
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(node.x - textWidth / 2 - 3, textY - fontSize / 2 - 2, textWidth + 6, fontSize + 4);
      
      // Text
      ctx.fillStyle = 'white';
      ctx.fillText(label, node.x, textY);
    });

    ctx.restore();
  }, [dimensions, zoom, pan, selectedNode]);

  // Redraw on state changes
  useEffect(() => {
    draw();
  }, [draw]);

  // Mouse handlers
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom,
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

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    const node = findNodeAtPosition(pos.x, pos.y);
    setSelectedNode(node);
    draw();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
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

  const handleZoomIn = () => setZoom(z => Math.min(4, z * 1.2));
  const handleZoomOut = () => setZoom(z => Math.max(0.3, z / 1.2));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
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
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Brain className="w-12 h-12 mb-4 opacity-50" />
        <p>Aucun concept à afficher</p>
        <p className="text-sm">Ajoutez des concepts pour voir votre graphe de connaissances</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full rounded-xl overflow-hidden bg-card/30 border border-border/50">
      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 bg-background/80 backdrop-blur-sm rounded-lg p-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(142, 60%, 45%)' }} />
          <span className="text-xs text-muted-foreground">Solide</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(35, 85%, 55%)' }} />
          <span className="text-xs text-muted-foreground">À revoir</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(0, 70%, 55%)' }} />
          <span className="text-xs text-muted-foreground">En danger</span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-lg p-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleReset}>
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="absolute bottom-4 left-4 z-10 bg-background/80 backdrop-blur-sm rounded-lg p-2">
        <p className="text-xs text-muted-foreground">
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
        className="cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      />

      {/* Selected Node Detail Modal */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 z-20"
          >
            <div className="bg-background/95 backdrop-blur-md border border-border rounded-xl p-4 shadow-xl max-w-md mx-auto">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground line-clamp-1">{selectedNode.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedNode.courseTitle}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => setSelectedNode(null)}
                >
                  <X className="h-4 w-4" />
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
                  style={{ 
                    borderColor: selectedNode.color,
                    color: selectedNode.color 
                  }}
                >
                  <Brain className="w-3 h-3 mr-1" />
                  {selectedNode.memoryStrength}% - {getStrengthLabel(selectedNode.memoryStrength)}
                </Badge>
                <Badge variant="secondary">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(selectedNode.nextReview)}
                </Badge>
                <Badge variant="secondary">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  {selectedNode.repetitions} révision(s)
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  size="sm"
                  onClick={handleReviewConcept}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Réviser maintenant
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
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
