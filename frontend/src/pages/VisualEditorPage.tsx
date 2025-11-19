import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useVisualEditorCanvas,
  useSaveVisualEditorCanvas,
  useVisualEditorComponents,
  useGenerateVisualEditorCode
} from '../hooks';

interface CanvasElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  props: Record<string, unknown>;
}

export const VisualEditorPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [zoom, setZoom] = useState(100);

  const { data: canvas, isLoading } = useVisualEditorCanvas(projectId || '');
  const { data: components } = useVisualEditorComponents();

  const saveCanvas = useSaveVisualEditorCanvas();
  const generateCode = useGenerateVisualEditorCode();

  const handleSaveCanvas = async () => {
    if (!projectId) return;
    await saveCanvas.mutateAsync({
      projectId,
      data: { elements: canvasElements, settings: { zoom } }
    });
  };

  const handleGenerateCode = async () => {
    if (!projectId) return;
    await generateCode.mutateAsync({
      projectId,
      data: { framework: 'react', typescript: true }
    });
  };

  const handleExport = async (format: string) => {
    if (!projectId) return;
    await exportDesign.mutateAsync({ projectId, format });
  };

  const handleAddElement = (type: string) => {
    const newElement: CanvasElement = {
      id: `element-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      props: {}
    };
    setCanvasElements([...canvasElements, newElement]);
  };

  const handleDeleteElement = () => {
    if (selectedElement) {
      setCanvasElements(canvasElements.filter(el => el.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  const componentLibrary = [
    { type: 'button', name: 'Button', icon: '[ ]' },
    { type: 'input', name: 'Input', icon: '[_]' },
    { type: 'text', name: 'Text', icon: 'Aa' },
    { type: 'image', name: 'Image', icon: '[]' },
    { type: 'container', name: 'Container', icon: '##' },
    { type: 'card', name: 'Card', icon: '[]' },
    { type: 'list', name: 'List', icon: '=-' },
    { type: 'form', name: 'Form', icon: '{}' },
    { type: 'navbar', name: 'Navbar', icon: '---' },
    { type: 'footer', name: 'Footer', icon: '___' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Visual Editor</h1>
          <p className="text-sm text-gray-400">Drag and drop UI builder</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSaveCanvas}
            disabled={saveCanvas.isPending}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-4 py-2 rounded-lg text-sm"
          >
            {saveCanvas.isPending ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleGenerateCode}
            disabled={generateCode.isPending}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 px-4 py-2 rounded-lg text-sm"
          >
            {generateCode.isPending ? 'Generating...' : 'Generate Code'}
          </button>
          <div className="relative group">
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm">
              Export
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg hidden group-hover:block z-10">
              <button
                onClick={() => handleExport('figma')}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-t-lg"
              >
                Figma
              </button>
              <button
                onClick={() => handleExport('sketch')}
                className="w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                Sketch
              </button>
              <button
                onClick={() => handleExport('png')}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-b-lg"
              >
                PNG
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Components */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="font-medium mb-4">Components</h2>
            <div className="grid grid-cols-2 gap-2">
              {componentLibrary.map(comp => (
                <button
                  key={comp.type}
                  onClick={() => handleAddElement(comp.type)}
                  className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center"
                >
                  <div className="text-lg mb-1">{comp.icon}</div>
                  <div className="text-xs">{comp.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          <div className="p-4 border-t border-gray-700">
            <h2 className="font-medium mb-4">History</h2>
            <div className="space-y-2 text-sm">
              {history && Array.isArray(history) ? (
                history.slice(0, 10).map((item: unknown, i: number) => (
                  <div key={i} className="text-gray-400 truncate">
                    {(item as { action?: string }).action || `Action ${i + 1}`}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No history yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-950 p-4">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setZoom(Math.max(25, zoom - 25))}
                className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
              >
                -
              </button>
              <span className="px-3 py-1">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
              >
                +
              </button>
            </div>
            {selectedElement && (
              <button
                onClick={handleDeleteElement}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
              >
                Delete Selected
              </button>
            )}
          </div>

          <div
            className="bg-white rounded-lg mx-auto relative"
            style={{
              width: `${(1200 * zoom) / 100}px`,
              height: `${(800 * zoom) / 100}px`,
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left'
            }}
          >
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Loading canvas...
              </div>
            ) : canvasElements.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Drag components here to start building
              </div>
            ) : (
              canvasElements.map(element => (
                <div
                  key={element.id}
                  onClick={() => setSelectedElement(element.id)}
                  className={`absolute cursor-move border-2 ${
                    selectedElement === element.id
                      ? 'border-blue-500'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height
                  }}
                >
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-600 text-sm">
                    {element.type}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-64 bg-gray-800 border-l border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="font-medium mb-4">Properties</h2>
            {selectedElement ? (
              <div className="space-y-4">
                {(() => {
                  const element = canvasElements.find(el => el.id === selectedElement);
                  if (!element) return null;
                  return (
                    <>
                      <div>
                        <label className="text-sm text-gray-400">Type</label>
                        <p className="font-medium">{element.type}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Position X</label>
                        <input
                          type="number"
                          value={element.x}
                          onChange={(e) => {
                            setCanvasElements(canvasElements.map(el =>
                              el.id === selectedElement
                                ? { ...el, x: parseInt(e.target.value) || 0 }
                                : el
                            ));
                          }}
                          className="w-full bg-gray-700 rounded px-3 py-2 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Position Y</label>
                        <input
                          type="number"
                          value={element.y}
                          onChange={(e) => {
                            setCanvasElements(canvasElements.map(el =>
                              el.id === selectedElement
                                ? { ...el, y: parseInt(e.target.value) || 0 }
                                : el
                            ));
                          }}
                          className="w-full bg-gray-700 rounded px-3 py-2 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Width</label>
                        <input
                          type="number"
                          value={element.width}
                          onChange={(e) => {
                            setCanvasElements(canvasElements.map(el =>
                              el.id === selectedElement
                                ? { ...el, width: parseInt(e.target.value) || 100 }
                                : el
                            ));
                          }}
                          className="w-full bg-gray-700 rounded px-3 py-2 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Height</label>
                        <input
                          type="number"
                          value={element.height}
                          onChange={(e) => {
                            setCanvasElements(canvasElements.map(el =>
                              el.id === selectedElement
                                ? { ...el, height: parseInt(e.target.value) || 50 }
                                : el
                            ));
                          }}
                          className="w-full bg-gray-700 rounded px-3 py-2 mt-1"
                        />
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Select an element to edit its properties</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualEditorPage;
