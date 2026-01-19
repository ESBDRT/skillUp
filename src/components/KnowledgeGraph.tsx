import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Calendar, RotateCcw, ExternalLink } from 'lucide-react';
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
  val: number;
  color: string;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string;
  target: string;
  type: 'course' | 'semantic';
  strength: number;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
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

// Generate graph data from concepts
const generateGraphData = (concepts: MemoryConcept[]): GraphData => {
  // Generate nodes
  const nodes: GraphNode[] = concepts.map(concept => ({
    id: concept.id,
    name: concept.concept_title,
    courseId: concept.course_id,
    courseTitle: concept.course_title || 'Cours inconnu',
    memoryStrength: concept.memory_strength ?? 50,
    content: concept.concept_content || '',
    nextReview: concept.next_review_at,
    repetitions: concept.repetitions ?? 0,
    val: Math.max(3, (concept.repetitions ?? 0) + 3), // Node size based on repetitions
    color: getStrengthColor(concept.memory_strength ?? 50),
  }));

  const links: GraphLink[] = [];
  
  // Group by course
  const courseGroups: Record<string, MemoryConcept[]> = {};
  concepts.forEach(concept => {
    if (!courseGroups[concept.course_id]) {
      courseGroups[concept.course_id] = [];
    }
    courseGroups[concept.course_id].push(concept);
  });

  // Create course-based links (chain within each course)
  Object.values(courseGroups).forEach(courseConcepts => {
    for (let i = 0; i < courseConcepts.length - 1; i++) {
      links.push({
        source: courseConcepts[i].id,
        target: courseConcepts[i + 1].id,
        type: 'course',
        strength: 0.8,
      });
    }
  });

  // Create semantic links (concepts with common keywords across courses)
  for (let i = 0; i < concepts.length; i++) {
    for (let j = i + 1; j < concepts.length; j++) {
      // Skip if same course (already linked)
      if (concepts[i].course_id === concepts[j].course_id) continue;
      
      if (hasCommonKeywords(concepts[i], concepts[j])) {
        links.push({
          source: concepts[i].id,
          target: concepts[j].id,
          type: 'semantic',
          strength: 0.3,
        });
      }
    }
  }

  return { nodes, links };
};

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
  concepts,
  filter = 'all',
  selectedCourseId,
}) => {
  const fgRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
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
  const graphData = useMemo(() => generateGraphData(filteredConcepts), [filteredConcepts]);

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width || 800,
          height: Math.max(400, window.innerHeight - 300),
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Node click handler
  const handleNodeClick = useCallback((node: any) => {
    setSelectedNode(node as GraphNode);
    
    // Zoom to node
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 500);
      fgRef.current.zoom(2, 500);
    }
  }, []);

  // Start review session for selected concept
  const handleReviewConcept = () => {
    if (selectedNode) {
      sessionStorage.setItem('targetedConceptIds', JSON.stringify([selectedNode.id]));
      navigate('/smart-session');
    }
  };

  // Custom node rendering
  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const graphNode = node as GraphNode;
    const label = graphNode.name;
    const fontSize = Math.max(10, 12 / globalScale);
    const nodeSize = graphNode.val * 2;
    
    // Draw node circle
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, nodeSize, 0, 2 * Math.PI);
    ctx.fillStyle = graphNode.color;
    ctx.fill();
    
    // Add glow effect for selected node
    if (selectedNode?.id === graphNode.id) {
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3 / globalScale;
      ctx.stroke();
    }
    
    // Draw label
    ctx.font = `${fontSize}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    
    // Truncate label if too long
    const maxWidth = 80;
    let displayLabel = label;
    if (ctx.measureText(label).width > maxWidth) {
      displayLabel = label.substring(0, 12) + '...';
    }
    
    // Draw text with background
    const textWidth = ctx.measureText(displayLabel).width;
    const textY = node.y! + nodeSize + fontSize;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(node.x! - textWidth / 2 - 2, textY - fontSize / 2 - 1, textWidth + 4, fontSize + 2);
    
    ctx.fillStyle = 'white';
    ctx.fillText(displayLabel, node.x!, textY);
  }, [selectedNode]);

  // Custom link rendering
  const linkCanvasObject = useCallback((link: any, ctx: CanvasRenderingContext2D) => {
    const graphLink = link as GraphLink;
    const source = link.source;
    const target = link.target;
    
    if (!source.x || !source.y || !target.x || !target.y) return;
    
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    
    if (graphLink.type === 'course') {
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.4)';
      ctx.lineWidth = 1.5;
    } else {
      ctx.strokeStyle = 'rgba(180, 130, 255, 0.25)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 3]);
    }
    
    ctx.stroke();
    ctx.setLineDash([]);
  }, []);

  // Format date for display
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

      {/* Stats */}
      <div className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm rounded-lg p-2">
        <p className="text-xs text-muted-foreground">
          {graphData.nodes.length} concepts • {graphData.links.length} liens
        </p>
      </div>

      {/* Graph */}
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        nodeCanvasObject={nodeCanvasObject}
        linkCanvasObject={linkCanvasObject}
        nodePointerAreaPaint={(node: any, color, ctx) => {
          const nodeSize = (node as GraphNode).val * 2;
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, nodeSize + 5, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        onNodeClick={handleNodeClick}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        linkDirectionalParticles={0}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        minZoom={0.5}
        maxZoom={4}
        backgroundColor="transparent"
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
