import React, { useState, useCallback, useEffect, useMemo } from "react";
import "./App.css";
import Map from "./components/Map";
import Menu from "./components/Menu";
import Tower from "./interfaces/Tower";
import CalculateLinks from "./util/Links";

// TODO: Add configuration file for these
const kingdoms = {
  pirates: {
    name: "Pirates",
    color: `rgb(0, 255, 0)`,
  },
  hots: {
    name: "Horde of the Summoned",
    color: `rgba(255, 0, 255)`,
  },
  freedom: {
    name: "Freedom Isles",
    color: `rgba(0, 255, 255)`,
  },
  planned: {
    name: "planned",
    color: `rgb(255, 255, 255)`,
  },
};

export default function App() {
  const [towers, setTowers] = useState<Array<Tower>>([]);
  const [closestTower, setClosestTower] = useState<Tower>();
  const [mapTile, setMapTile] = useState({ x: -1, y: -1 });

  const [showInfluence, setShowInfluence] = useState(true);
  const [showMaxDist, setShowMaxDist] = useState(false);
  const [showMinDist, setShowMinDist] = useState(false);
  const [showTowerNames, setShowTowerNames] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [searchedTower, setSearchedTower] = useState<Tower | null>(null);
  const [alpha, setAlpha] = useState(0.3);

  //TODO: Move WS code to separate file
  const [ws, setWs] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:80/");
    ws.onopen = () => {
      setWs(ws);
    };
    ws.onclose = () => {};

    ws.onerror = (err) => {
      console.log("Error connecting to server");
      ws.close();
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (!ws) return;
    ws.onmessage = (msgString) => {
      try {
        const msg = JSON.parse(msgString.data);
        switch (msg.action) {
          case "REFRESH_TOWERS":
            console.log("Refreshing towers");
            fetchTowers();
            break;

          default:
            console.log("Unknown action received");
            break;
        }
      } catch {}
    };
    ws.send("ready");
  }, [ws]);

  const sendAddTower = useCallback(() => {
    if (!ws) return;
    ws.send(JSON.stringify({ action: "NEW_TOWER" }));
  }, [ws]);

  const sendDeleteTower = useCallback(() => {
    if (!ws) return;
    ws.send(JSON.stringify({ action: "DELETE_TOWER" }));
  }, [ws]);

  const sendUpdateTower = useCallback(() => {
    if (!ws) return;
    ws.send(JSON.stringify({ action: "UPDATE_TOWER" }));
  }, [ws]);

  const onMapClick = useCallback((pos: { x: number; y: number }) => {
    setMapTile(pos);
  }, []);

  const getClosestTower = (
    towers: Array<Tower>,
    pos: { x: number; y: number }
  ) => {
    let minDist = Infinity;
    let closest: Tower;
    const { x, y } = pos;
    for (const t of towers) {
      const dist = Math.sqrt(Math.pow(x - t.x, 2) + Math.pow(y - t.y, 2));
      if (dist < minDist) {
        minDist = dist;
        closest = t;
      }
    }
    return closest!;
  };

  const fetchTowers = async () => {
    try {
      const res = await fetch("/api/towers", { method: "GET" });
      const jsonData = await res.json();
      let newTowers: Array<Tower> = [];
      let resArray: Array<Tower> = jsonData;
      for (const tower of resArray) {
        if (tower.kingdom in kingdoms) {
          const color = kingdoms[tower.kingdom].color;
          newTowers.push({
            ...tower,
            color: color,
            linked: tower.capital ? true : false,
            neighbours: [],
          });
        }
      }
      CalculateLinks(newTowers);
      setTowers(newTowers);
    } catch {
      console.log("Error retrieving towers");
    }
  };

  // Get towers from API on page load
  useEffect(() => {
    fetchTowers();
  }, []);

  // Create the tower on selected map tile and send to database
  const onCreateTower = useCallback(
    async (name: string, kingdom: string, ql: number) => {
      const tower = {
        x: mapTile.x,
        y: mapTile.y,
        name: name,
        kingdom: kingdom,
        ql: ql,
        capital: false,
      };
      const body = JSON.stringify(tower);
      try {
        await fetch("/api/towers", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: body,
        });
      } catch (error) {
        console.log("Error creating tower");
      }

      await fetchTowers();
      sendAddTower();
    },
    [mapTile, sendAddTower]
  );

  // Send request to delete tower with the specified ID
  const deleteTower = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/towers/${id}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.log("Error deleting tower");
      }
      await fetchTowers();
      sendDeleteTower();
    },
    [sendDeleteTower]
  );

  // Update tower with the id specified
  const updateTower = useCallback(
    async (id: string, name: string, ql: number, kingdom: string) => {
      const body = JSON.stringify({ name: name, ql: ql, kingdom: kingdom });
      try {
        await fetch(`/api/towers/${id}`, {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: body,
        });
      } catch (error) {
        console.log("Error updating tower");
      }
      await fetchTowers();
      sendUpdateTower();
    },
    [sendUpdateTower]
  );

  // Update closest tower when towers or selected map tile changes
  useEffect(() => {
    if (mapTile.x === -1 && mapTile.y === -1) return;
    setClosestTower(getClosestTower(towers, mapTile));
  }, [towers, mapTile]);

  const towerNames = useMemo(() => {
    let names = [];
    for (const tower of towers) {
      names.push(tower.name);
    }
    names.sort();
    return names;
  }, [towers]);

  const findTower = useCallback(
    (name: string) => {
      const tower = towers.find((t) => {
        return t.name === name;
      });
      if (tower === undefined) return;
      setMapTile({ x: tower.x, y: tower.y });
      setSearchedTower(Object.assign({}, tower || null));
    },
    [towers]
  );

  return (
    <React.Fragment>
      <Map
        towers={towers}
        onMapClickCallback={onMapClick}
        showInfluence={showInfluence}
        showMinDist={showMinDist}
        showMaxDist={showMaxDist}
        showTowerNames={showTowerNames}
        showPreview={showPreview}
        showLinks={showLinks}
        searchedTower={searchedTower}
        alpha={alpha}
        setAlpha={setAlpha}
      />
      <div id="menu-container">
        <Menu
          pos={mapTile}
          closestTower={closestTower!}
          onCreateTower={onCreateTower}
          onDeleteTower={deleteTower}
          onUpdateTower={updateTower}
          showInfluence={showInfluence}
          showMinDist={showMinDist}
          showMaxDist={showMaxDist}
          showTowerNames={showTowerNames}
          showPreview={showPreview}
          showLinks={showLinks}
          alpha={alpha}
          setShowInfluence={setShowInfluence}
          setShowMinDist={setShowMinDist}
          setShowMaxDist={setShowMaxDist}
          setShowTowerNames={setShowTowerNames}
          setShowPreview={setShowPreview}
          setShowLinks={setShowLinks}
          setAlpha={setAlpha}
          towerNames={towerNames}
          onSearch={findTower}
        />
      </div>
    </React.Fragment>
  );
}
