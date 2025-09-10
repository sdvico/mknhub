import Utils from '@/app/library/utils';
import {ColorDefault} from '@/app/themes/color';
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import {LatLng, LeafletView, MapShape} from 'react-native-leaflet-view';
import Server from 'react-native-static-server';
import Loading from '../common/screens/loading';

const fileDir = Platform.select({
  android: `${RNFS.DocumentDirectoryPath}/webroot`,
  ios: `${RNFS.MainBundlePath}/webroot`,
  windows: `${RNFS.MainBundlePath}\\webroot`,
  default: '',
});

const port = 7071;

const DEFAULT_MAP_LAYERS = [
  {
    attribution:
      '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    baseLayerIsChecked: true,
    baseLayerName: 'SDhub.Mapnik',
    url: `http://localhost:${port}/{z}/{x}/{y}.png`,
  },
];
const markerSVG = `<svg 
  xmlns="http://www.w3.org/2000/svg" 
  width="30px" 
  height="30px" 
  viewBox="0 0 24 24" 
  fill="red">
  <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
</svg>
`;

export const DEFAULT_COORDINATE: LatLng = {
  lat: 0,
  lng: 0,
};

export const DEFAULT_COORDINATE_MAP: LatLng = {
  lat: 10.6,
  lng: 106.7,
};

export async function extractBundledAssets(
  into = RNFS.DocumentDirectoryPath,
  from = '',
) {
  if (Platform.OS !== 'android') {
    return;
  }

  await RNFS.mkdir(into);
  const assets = await RNFS.readDirAssets(from);
  for (let i = 0; i < assets.length; ++i) {
    try {
      const asset = assets[i]!;
      const target = `${into}/${asset.name}`;
      if (asset.isDirectory()) {
        await extractBundledAssets(target, asset.path);
      } else {
        await RNFS.copyFileAssets(asset.path, target);
      }
    } catch (error) {}
  }
}

export const prepareAssets = async () => {
  const targetWebrootPathOnDevice = `${RNFS.DocumentDirectoryPath}/webroot`;
  const alreadyExtracted = await RNFS.exists(targetWebrootPathOnDevice);
  // realistic code.
  if (!alreadyExtracted) {
    await extractBundledAssets(fileDir, 'webroot');
  } else {
  }
};

export const MapView = React.forwardRef(
  (
    {
      point,
      handleMapMessage,
      customMarkers = [],
      showInBottomSheet = false,
      onSendLocation,
      showSendButton = false,
    }: {
      point: LatLng;
      handleMapMessage: (message: any) => void;
      customMarkers?: Array<{lat: number; lng: number}>;
      showInBottomSheet?: boolean;
      onSendLocation?: () => void;
      showSendButton?: boolean;
    },
    ref,
  ) => {
    const LoadingRef = React.useRef<RefObject>(null);

    const [_toMarker, _setToMarker] = useState<MapShape | undefined>(undefined);

    useEffect(() => {
      const server = new Server(port, fileDir, {localOnly: true});
      (async () => {
        LoadingRef.current?.toggleState(true);
        try {
          // Chuẩn bị assets trên Android
          if (Platform.OS === 'android') {
            await prepareAssets();
          }

          // Khởi động server
          const url = await server.start();
          LoadingRef.current?.toggleState(false);
        } catch (error) {
          console.error('Error initializing map:', error);
          LoadingRef.current?.toggleState(false);
        }
      })();

      // Cleanup server khi component unmount
      return () => {
        server.stop();
      };
    }, []);

    // useEffect(() => {
    //   initServer();
    //   return () => {
    //     return server.current?.stop();
    //   };
    // }, []);

    // const bounds = React.useMemo(() => {
    //   const _bounds = border_points.map((item: any) => ({
    //     lat: item.lat,
    //     lng: item.lng,
    //   }));

    //   const mapShapes: MapShape = {
    //     color: '#B46060',
    //     id: '11',
    //     positions: _bounds,
    //     // radius: 100,
    //     shapeType: MapShapeType.POLYLINE,
    //   };

    //   return mapShapes;
    // }, [border_points]);

    // const customMarkerLines = React.useMemo(() => {
    //   if (!customMarkers || customMarkers.length === 0) {
    //     return null;
    //   }

    //   const _bounds = customMarkers.map((item: any) => ({
    //     lat: item.lat,
    //     lng: item.lng,
    //   }));

    //   const mapShapes: MapShape = {
    //     color: ColorDefault.orange,
    //     id: '100',
    //     positions: _bounds,
    //     shapeType: MapShapeType.POLYLINE,
    //   };

    //   return mapShapes;
    // }, [customMarkers]);

    // const maps = React.useMemo(() => {
    //   const _bounds = map.map((item: any) => ({
    //     lat: item.lat,
    //     lng: item.lng,
    //   }));

    //   const mapShapes: MapShape = {
    //     color: '#5F264A',
    //     id: '22',
    //     positions: _bounds,
    //     // radius: 100,
    //     shapeType: MapShapeType.POLYGON,
    //   };

    //   return mapShapes;
    // }, [map]);

    // const _bounds = useMemo(() => {
    //   const shapes = [bounds, maps];

    //   if (_toMarker) {
    //     shapes.push(_toMarker);
    //   }

    //   if (customMarkerLines) {
    //     shapes.push(customMarkerLines);
    //   }

    //   return shapes;
    // }, [bounds, _toMarker, maps, customMarkerLines]);

    const mapCenterPosition = useMemo(() => {
      return point.lat ? point : DEFAULT_COORDINATE_MAP;
    }, [point]);
    return (
      <View
        pointerEvents="box-none"
        style={[
          styles.container,
          showInBottomSheet && styles.bottomSheetContainer,
          {minHeight: Utils.deviceWidth},
        ]}>
        <LeafletView
          mapMarkers={[
            {
              position: point.lat ? point : DEFAULT_COORDINATE_MAP,
              icon: markerSVG,
              size: [20, 20],
              iconAnchor: [10, 10],
              id: '1',
            },
          ]}
          mapCenterPosition={mapCenterPosition}
          zoom={6}
          mapLayers={DEFAULT_MAP_LAYERS}
          onMessageReceived={handleMapMessage}
          // mapShapes={_bounds}
        />
        {showInBottomSheet && showSendButton && (
          <View style={styles.sendLocationButtonContainer}>
            <TouchableOpacity
              style={styles.sendLocationButton}
              onPress={onSendLocation}>
              <Text style={styles.sendLocationButtonText}>Gửi vị trí</Text>
            </TouchableOpacity>
          </View>
        )}

        <Loading
          ref={LoadingRef}
          title="Đang đồng bộ data và lấy vị trí hiện tại"
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  bottomSheetContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sendLocationButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  sendLocationButton: {
    backgroundColor: ColorDefault.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sendLocationButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorDefault.white,
  },
  safeArea: {
    height: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
  },
  headerImage: {
    height: 120,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    marginTop: -30,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    width: '100%',
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#212121',
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#757575',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#424242',
  },
  row: {flexDirection: 'row', alignItems: 'center', gap: 10},
  scheduleTxt: {
    fontSize: 20,
    color: '#000',
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  pickerModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  pickerModalContainerPosition: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    right: '10%',
    padding: 10,
    marginHorizontal: -25,
    maxHeight: Platform.OS === 'ios' ? 250 : 265,
    backgroundColor: '#fff',
    borderRadius: 8,
    gap: 10,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  goButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 1 : 10,
    width: '100%',
    backgroundColor: '#005492',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonTxt: {color: '#fff', fontWeight: 'bold', fontSize: 22},
  mapContainer: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 40 : 50,
    borderRadius: 20,
    backgroundColor: 'red',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#1976d2',
    position: 'relative',
  },
  coordinatesContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(25, 118, 210, 0.7)',
    borderRadius: 8,
    padding: 10,
    zIndex: 1,
    flexDirection: 'column',
  },
  coordinateText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  editButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    color: 'white',
    fontSize: 14,
  },
  locationMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
  },
  submitButton: {
    backgroundColor: '#1565c0',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 30,
    padding: 5,
    zIndex: 1000,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#005492',
    fontWeight: 'bold',
  },
  coordinateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#AFCDEE',
    borderRadius: 16,
    paddingHorizontal: 4,
    height: 40,
  },
  coordinateInput: {
    width: 45,
    height: 38,
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
    padding: 0,
  },
  coordinateDirectionInput: {
    fontSize: 24,
    textAlign: 'center',
    color: '#000',
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
});
