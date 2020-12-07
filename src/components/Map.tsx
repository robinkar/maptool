import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

import mapDump from "./../map-terrain.png";
import Tower from "./../interfaces/Tower";

export default function Map(props: {
  towers: Array<Tower>;
  onMapClickCallback: Function;
  showInfluence: boolean;
  showMinDist: boolean;
  showMaxDist: boolean;
  showTowerNames: boolean;
  showPreview: boolean;
  showLinks: boolean;
  searchedTower: Tower | null;
  alpha: number;
  setAlpha: Function;
}) {

  const { height, width } = useWindowDimensions();

  const [center, setCenter] = useState({ x: 2048, y: 2048 });
  const [zoom, setZoom] = useState(1);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [lastTile, setLastTile] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [mouseOverPos, setMouseOverPos] = useState({ x: 0, y: 0 });


  const canvas = useRef<HTMLCanvasElement>(null);
  const img = useRef<HTMLImageElement>(null);

  // Update map once map image has loaded
  useEffect(() => {
    img.current!.onload = () => {
      updateCanvas();
      drawTowers();
    };
    // eslint-disable-next-line
  }, []);


  // Center map at searched tower when searched tower changes
  useEffect(() => {
    if (props.searchedTower === null) return;
    setCenter({ x: props.searchedTower.x, y: props.searchedTower.y });
  }, [props.searchedTower]);


  // Update map when relevant data changes
  useEffect(() => {
    updateCanvas();
    drawTowers();
    drawMousePos();
    // eslint-disable-next-line
  }, [center, zoom, height, width, mouseOverPos, lastTile, props]);

  // Converts a position on the map to a position on the canvas
  const mp2cp = (w: number, h: number, x: number, y: number) => {
    const xStart = center.x - w / 2 / zoom;
    const yStart = center.y - h / 2 / zoom;
    return {
      x: (x - xStart) * zoom + zoom / 2,
      y: (y - yStart) * zoom + zoom / 2,
    };
  };

  // Converts a canvas position to a position on the map
  const cp2mp = (w: number, h: number, x: number, y: number) => {
    const offsetX = (x - w / 2) / zoom;
    const offsetY = (y - h / 2) / zoom;
    return {
      x: Math.floor(center.x + offsetX),
      y: Math.floor(center.y + offsetY),
    };
  };

  const md2cd = (dist: number) => {
    return dist * zoom;
  };

  // Update distances for tower boxes after zoom
  const maxDist = useMemo(() => {
    if (props.showMaxDist) {
      return md2cd(100.5);
    } else if (props.showInfluence) {
      return md2cd(60.5);
    } else if (props.showMinDist) {
      return md2cd(50.5);
    }
    return 0;
    // eslint-disable-next-line
  }, [props, zoom]);

  // Draw towers on map
  const drawTowers = () => {
    const ctx = canvas.current!.getContext("2d")!;
    const { w, h } = getCanvasSize();
    let fontSize = 16;
    ctx.font = `${fontSize}px Arial`;
    
    let done: Array<Tower> = [];

    for (const tower of props.towers) {
      const { x, y, color, name } = tower;
      if (color === undefined) continue;

      // Get the location on canvas for the map tile the tower is on
      const { x: cx, y: cy } = mp2cp(w, h, x, y);

      // Skip towers outside canvas
      if (
        cx < -maxDist ||
        cy < -maxDist ||
        cx > w + maxDist ||
        cy > h + maxDist
      )
        continue;
      ctx.globalAlpha = props.alpha;
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;

      //Influence
      let r = md2cd(60.5);
      if (props.showInfluence) {
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }

      r = md2cd(49.5);
      if (props.showMinDist) {
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }

      r = md2cd(100.5);
      if (props.showMaxDist) {
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }

      //Links
      if (props.showLinks) {
        ctx.globalAlpha = 0.8;
        for (const link of tower.neighbours) {
          // Skip drawing link if the linked tower has been drawn
          if (done.includes(link)) continue;
          const { x: linkcx, y: linkcy } = mp2cp(w, h, link.x, link.y);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(linkcx, linkcy);
          ctx.stroke();
          //console.log(linkcx, linkcy);
        }
        done.push(tower);
        // Draw a link to last clicked location if the setting is enabled and in range
        if (props.showPreview) {
          const tilePos = mp2cp(w, h, lastTile.x, lastTile.y);
          if (
            Math.abs(tower.x - lastTile.x) <= 100 &&
            Math.abs(tower.y - lastTile.y) <= 100
          ) {
            const { x: lcx, y: lcy } = tilePos;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(lcx, lcy);
            ctx.stroke();
          }
        }
      }

      // Draw a dot on the map tile
      ctx.beginPath();
      ctx.globalAlpha = 0.7;
      ctx.arc(cx, cy, 1.5 * zoom, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1;

      if (zoom < 1 || !props.showTowerNames) continue;
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.font = `${fontSize}px Arial`;
      const text = name;
      // Decrease font until text fits in tower
      while (ctx.measureText(text).width > r - 5) {
        fontSize--;
        ctx.font = `${fontSize}px Arial`;
      }
      ctx.fillText(text, cx - ctx.measureText(text).width / 2, cy);
    }
  };

  // Draw mouse position in upper right corner and tower preview
  const drawMousePos = () => {
    if (img.current == null) return;
    const ctx = canvas.current!.getContext("2d")!;
    const { x: cx, y: cy } = mouseOverPos;

    const { w, h } = getCanvasSize();
    const { x: mx, y: my } = cp2mp(w, h, cx, cy);
    const text = `${mx}, ${my}`;

    ctx.fillStyle = "rgba(39, 39, 39, 0.9)";
    ctx.font = `16px Arial`;
    const textSize = ctx.measureText(text);
    ctx.fillRect(w - textSize.width - 20, 0, h, 20);
    ctx.fillStyle = "rgba(204, 204, 204, 1)";
    ctx.fillText(text, w - textSize.width - 10, 16);

    const tilePos = mp2cp(w, h, lastTile.x, lastTile.y);

    // Draw tower preview on last clicked map tile
    if (props.showPreview) {
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = "rgb(255, 255, 255)";

      const { x: lcx, y: lcy } = tilePos;
      //Influence
      let r = md2cd(60.5);
      if (
        props.showInfluence &&
        !(lcx < -r || lcy < -r || lcx > w + r || lcy > h + r)
      ) {
        ctx.fillRect(lcx - r, lcy - r, r * 2, r * 2);
      }

      r = md2cd(49.5);
      if (
        props.showMinDist &&
        !(lcx < -r || lcy < -r || lcx > w + r || lcy > h + r)
      ) {
        ctx.fillRect(lcx - r, lcy - r, r * 2, r * 2);
      }
      r = md2cd(100.5);
      if (
        props.showMaxDist &&
        !(lcx < -r || lcy < -r || lcx > w + r || lcy > h + r)
      ) {
        ctx.fillRect(lcx - r, lcy - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
    }

    ctx.beginPath();
    ctx.arc(
      tilePos.x,
      tilePos.y,
      zoom > 1 ? 4 * Math.log(zoom) : 3,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fill();
  };

  // Draw map image
  const updateCanvas = () => {
    if (img.current == null) return;
    const ctx = canvas.current!.getContext("2d")!;
    if (zoom < 1) {
      ctx.imageSmoothingEnabled = true;
    } else {
      ctx.imageSmoothingEnabled = false;
    }
    const { w, h } = getCanvasSize();

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    const sx = w / zoom;
    const sy = h / zoom;
    ctx.drawImage(
      img.current,
      center.x - sx / 2,
      center.y - sy / 2,
      sx,
      sy,
      0,
      0,
      w,
      h
    );
  };

  const getCanvasSize = () => {
    const cWidth = canvas.current!.width;
    const cHeight = canvas.current!.height;

    return { w: cWidth, h: cHeight };
  };

  const getMousePosInCanvas = (mouseX: number, mouseY: number) => {
    const canv = canvas.current!;
    const canvasRect = canv.getBoundingClientRect();
    const mousePos = {
      x: mouseX - canvasRect.left,
      y: mouseY - canvasRect.top,
    };
    return mousePos;
  };

  const onMapClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      const { x, y } = lastPos;
      const { w, h } = getCanvasSize();
      const tile = cp2mp(w, h, x, y);
      setLastTile(tile);
      props.onMapClickCallback(tile);
    },
    // eslint-disable-next-line
    [lastPos, props]
  );

  const onMouseWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      // Zoom in or out 2x
      const zoomMod = e.deltaY > 0 ? 0.5 : 2;

      // Limit zoom to reasonable values
      if (zoom * zoomMod < 0.0625 || zoom * zoomMod > 64) return;

      setZoom(zoom * zoomMod);

      // Zoom in map towards mouse cursor
      const { w, h } = getCanvasSize();
      const canv = canvas.current!;
      const canvasRect = canv.getBoundingClientRect();
      const mousePos = getMousePosInCanvas(e.clientX, e.clientY);

      const canvasCenter = {
        x: canvasRect.left + w / 2,
        y: canvasRect.top + h / 2,
      };
      const offset = {
        x: Math.floor((mousePos.x - canvasCenter.x) / zoom),
        y: Math.floor((mousePos.y - canvasCenter.y) / zoom),
      };
      if (e.deltaY > 0) {
        setCenter({ x: center.x - offset.x, y: center.y - offset.y });
      } else {
        setCenter({ x: center.x + offset.x / 2, y: center.y + offset.y / 2 });
      }
    },
    [center, zoom]
  );

  // Handle map dragging
  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      const canvasPos = getMousePosInCanvas(e.clientX, e.clientY);

      setLastPos(canvasPos);
      setIsDragging(true);
    },
    []
  );

  // Stop dragging the map
  const onMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      setIsDragging(false);
    },
    []
  );

  // Mobile functionality not working properly currently(need zoom event)
  const onTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    const canvasPos = getMousePosInCanvas(touch.clientX, touch.clientY);

    setLastPos(canvasPos);
    setIsDragging(true);
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
  }, []);


  // Update mouse hover position and handle dragging
  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      const dx = e.nativeEvent.offsetX;
      const dy = e.nativeEvent.offsetY;
      setMouseOverPos({ x: dx, y: dy });

      if (!isDragging) return;

      const changeX = (dx - lastPos.x) / zoom;
      const changeY = (dy - lastPos.y) / zoom;
      setLastPos({ x: dx, y: dy });

      setCenter({ x: center.x - changeX, y: center.y - changeY });
    },
    [lastPos, zoom, center, isDragging]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const touch = e.touches[0];
      const dx = touch.clientX;

      const dy = touch.clientY;
      const pos = getMousePosInCanvas(dx, dy);
      setMouseOverPos({ x: pos.x, y: pos.y });
      if (!isDragging) return;

      const changeX = (pos.x - lastPos.x) / zoom;
      const changeY = (pos.y - lastPos.y) / zoom;
      setLastPos(pos);

      setCenter({ x: center.x - changeX, y: center.y - changeY });
    },
    [lastPos, zoom, center, isDragging]
  );

  // Stop dragging when mouse leaves map
  const onMouseOut = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      setIsDragging(false);
    },
    []
  );

  return (
    <div id="map">
      <canvas
        ref={canvas}
        width={0.85 * width - 15}
        height={height - 15}
        onClick={onMapClick}
        onWheel={onMouseWheel}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseOut={onMouseOut}
      />
      <img ref={img} src={mapDump} style={{ display: "none" }} alt="" />
    </div>
  );
}


// Window resize handling

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowDimensions;
}
