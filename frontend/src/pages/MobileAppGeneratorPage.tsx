import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useMobileAppScreens,
  useGenerateMobileApp,
  useSaveMobileAppScreens
} from '../hooks';

interface Screen {
  id: string;
  name: string;
  components: { type: string; props: Record<string, unknown> }[];
}

export const MobileAppGeneratorPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [screens, setScreens] = useState<Screen[]>([
    { id: '1', name: 'Home', components: [] },
    { id: '2', name: 'Profile', components: [] },
    { id: '3', name: 'Settings', components: [] },
  ]);
  const [selectedScreen, setSelectedScreen] = useState<string>('1');
  const [platform, setPlatform] = useState<'react-native' | 'flutter' | 'ionic'>('react-native');
  const [deviceType, setDeviceType] = useState<'iphone' | 'android'>('iphone');

  const { data: savedScreens, isLoading } = useMobileAppScreens(projectId || '');
  const generateApp = useGenerateMobileApp();
  const saveScreens = useSaveMobileAppScreens();

  const handleGenerateApp = async () => {
    if (!projectId) return;
    await generateApp.mutateAsync({
      projectId,
      data: { platform, screens }
    });
  };

  const handleSaveScreens = async () => {
    if (!projectId) return;
    await saveScreens.mutateAsync({
      projectId,
      data: { screens }
    });
  };

  const handleAddScreen = () => {
    const newScreen: Screen = {
      id: `${Date.now()}`,
      name: `Screen ${screens.length + 1}`,
      components: []
    };
    setScreens([...screens, newScreen]);
  };

  const handleDeleteScreen = (id: string) => {
    if (screens.length > 1) {
      setScreens(screens.filter(s => s.id !== id));
      if (selectedScreen === id) {
        setSelectedScreen(screens[0].id);
      }
    }
  };

  const handleAddComponent = (type: string) => {
    setScreens(screens.map(screen => {
      if (screen.id === selectedScreen) {
        return {
          ...screen,
          components: [...screen.components, { type, props: {} }]
        };
      }
      return screen;
    }));
  };

  const mobileComponents = [
    { type: 'header', name: 'Header', icon: '---' },
    { type: 'button', name: 'Button', icon: '[ ]' },
    { type: 'text', name: 'Text', icon: 'Aa' },
    { type: 'image', name: 'Image', icon: '[]' },
    { type: 'input', name: 'Input', icon: '[_]' },
    { type: 'list', name: 'List', icon: '=-' },
    { type: 'card', name: 'Card', icon: '[]' },
    { type: 'tabs', name: 'Tab Bar', icon: '...' },
    { type: 'map', name: 'Map', icon: 'O' },
    { type: 'camera', name: 'Camera', icon: '@' },
  ];

  const currentScreen = screens.find(s => s.id === selectedScreen);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Mobile App Generator</h1>
          <p className="text-gray-400 mt-2">Design and generate mobile apps for iOS and Android</p>
        </header>

        {/* Platform Selection */}
        <div className="flex gap-4 mb-6">
          <div>
            <label className="text-sm text-gray-400 block mb-2">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as typeof platform)}
              className="bg-gray-800 rounded-lg px-4 py-2"
            >
              <option value="react-native">React Native</option>
              <option value="flutter">Flutter</option>
              <option value="ionic">Ionic</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-2">Device Preview</label>
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value as typeof deviceType)}
              className="bg-gray-800 rounded-lg px-4 py-2"
            >
              <option value="iphone">iPhone</option>
              <option value="android">Android</option>
            </select>
          </div>
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleSaveScreens}
              disabled={saveScreens.isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-4 py-2 rounded-lg"
            >
              {saveScreens.isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleGenerateApp}
              disabled={generateApp.isPending}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 px-4 py-2 rounded-lg"
            >
              {generateApp.isPending ? 'Generating...' : 'Generate App'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Screens List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-medium">Screens</h2>
                <button
                  onClick={handleAddScreen}
                  className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-sm"
                >
                  +
                </button>
              </div>
              <div className="space-y-2">
                {screens.map(screen => (
                  <div
                    key={screen.id}
                    className={`flex justify-between items-center p-3 rounded-lg cursor-pointer ${
                      selectedScreen === screen.id
                        ? 'bg-blue-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedScreen(screen.id)}
                  >
                    <span>{screen.name}</span>
                    {screens.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteScreen(screen.id);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        x
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Components */}
            <div className="bg-gray-800 rounded-lg p-4 mt-4">
              <h2 className="font-medium mb-4">Components</h2>
              <div className="grid grid-cols-2 gap-2">
                {mobileComponents.map(comp => (
                  <button
                    key={comp.type}
                    onClick={() => handleAddComponent(comp.type)}
                    className="bg-gray-700 hover:bg-gray-600 p-2 rounded text-center text-sm"
                  >
                    <div className="mb-1">{comp.icon}</div>
                    <div className="text-xs">{comp.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Device Preview */}
          <div className="lg:col-span-2 flex justify-center">
            <div className={`relative ${
              deviceType === 'iphone'
                ? 'w-[300px] h-[600px] rounded-[40px]'
                : 'w-[280px] h-[580px] rounded-[20px]'
            } bg-black p-3`}>
              {/* Notch/Camera */}
              {deviceType === 'iphone' && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl" />
              )}

              {/* Screen */}
              <div className={`w-full h-full bg-gray-100 ${
                deviceType === 'iphone' ? 'rounded-[30px]' : 'rounded-[10px]'
              } overflow-hidden`}>
                {/* Status Bar */}
                <div className="h-8 bg-gray-200 flex items-center justify-between px-4 text-xs text-gray-600">
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <span>---</span>
                    <span>|||</span>
                  </div>
                </div>

                {/* Screen Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    {currentScreen?.name}
                  </h3>
                  {currentScreen?.components.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center mt-10">
                      Add components from the sidebar
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {currentScreen?.components.map((comp, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
                          <span className="text-gray-600 text-sm">{comp.type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tab Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-4">
                  <div className="text-center">
                    <div className="text-blue-500">O</div>
                    <div className="text-xs text-gray-600">Home</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">O</div>
                    <div className="text-xs text-gray-400">Search</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">O</div>
                    <div className="text-xs text-gray-400">Profile</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Properties */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="font-medium mb-4">Screen Properties</h2>
              {currentScreen && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Screen Name</label>
                    <input
                      type="text"
                      value={currentScreen.name}
                      onChange={(e) => {
                        setScreens(screens.map(s =>
                          s.id === selectedScreen
                            ? { ...s, name: e.target.value }
                            : s
                        ));
                      }}
                      className="w-full bg-gray-700 rounded px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Components</label>
                    <p className="text-lg font-bold">{currentScreen.components.length}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Navigation</label>
                    <select className="w-full bg-gray-700 rounded px-3 py-2 mt-1">
                      <option>Stack</option>
                      <option>Tab</option>
                      <option>Drawer</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Code Preview */}
            <div className="bg-gray-800 rounded-lg p-4 mt-4">
              <h2 className="font-medium mb-4">Code Preview</h2>
              <pre className="text-xs text-gray-400 overflow-auto max-h-48">
{`import React from 'react';
import { View, Text } from 'react-native';

export const ${currentScreen?.name || 'Screen'} = () => {
  return (
    <View>
      <Text>${currentScreen?.name}</Text>
    </View>
  );
};`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppGeneratorPage;
