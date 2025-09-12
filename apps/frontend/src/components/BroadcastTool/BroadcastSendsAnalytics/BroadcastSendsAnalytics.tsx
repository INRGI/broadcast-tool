import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Autocomplete,
  TextField,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Stack,
  Button,
  Chip,
  Tooltip,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import EventIcon from "@mui/icons-material/Event";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { GetBroadcastsSendsResponseDto } from "../../../api/broadcast";

interface CopyStat {
  copy: string;
  sends: number;
}
interface ProductStat {
  product: string;
  sends: number;
  copies: CopyStat[];
}
interface PartnerStat {
  partner: string;
  sends: number;
  products: ProductStat[];
}
interface BroadcastDay {
  date: string;
  partners: PartnerStat[];
}
interface BroadcastDto {
  name: string;
  result: BroadcastDay[];
}

type Entry = {
  date: string;
  broadcast: string;
  partner: string;
  product: string;
  copy: string;
  sends: number;
};

type TeamKey = `t_${string}`;

type CopyRow = {
  id: string;
  copy: string;
  total: number;
} & Record<TeamKey, number>;

interface PartnerRow {
  id: string;
  name: string;
  sends: number;
  productsSummary: string;
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#121212", paper: "#1e1e1e" },
    primary: { main: "#6a5acd" },
    text: { primary: "#ffffff", secondary: "#aaaaaa" },
  },
});

interface Props {
  data: GetBroadcastsSendsResponseDto;
  onRequestChangeDates?: () => void; 
}

const BroadcastSendsAnalytics: React.FC<Props> = ({ data, onRequestChangeDates }) => {
  const [selectedBroadcast, setSelectedBroadcast] = useState<string>("All");
  const [selectedDate, setSelectedDate] = useState<string | null>(null); 
  const [selectedPartner, setSelectedPartner] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<string>("All");

  const broadcasts = useMemo<BroadcastDto[]>(() => {
    const bs = Array.isArray((data as any).broadcasts)
      ? (data as any).broadcasts
      : [];
    return bs.filter(
      (b: BroadcastDto) => Array.isArray(b?.result) && b.result.length > 0
    );
  }, [data]);

  const activeBroadcasts = useMemo<BroadcastDto[]>(() => {
    return selectedBroadcast === "All"
      ? broadcasts
      : broadcasts.filter((b) => b.name === selectedBroadcast);
  }, [broadcasts, selectedBroadcast]);

  const availableDates = useMemo<string[]>(() => {
    const dateSet = new Set<string>();
    activeBroadcasts.forEach((b) =>
      b.result.forEach((r) => dateSet.add(r.date))
    );
    return Array.from(dateSet).sort();
  }, [activeBroadcasts]);

  const allPartners = useMemo<string[]>(() => {
    const set = new Set<string>();
    activeBroadcasts.forEach((b) =>
      b.result.forEach((d) => d.partners.forEach((p) => set.add(p.partner)))
    );
    return ["All", ...Array.from(set).sort()];
  }, [activeBroadcasts]);

  const allProducts = useMemo<string[]>(() => {
    const set = new Set<string>();
    activeBroadcasts.forEach((b) =>
      b.result.forEach((d) =>
        d.partners
          .filter(
            (p) => selectedPartner === "All" || p.partner === selectedPartner
          )
          .forEach((p) => p.products.forEach((prod) => set.add(prod.product)))
      )
    );
    return ["All", ...Array.from(set).sort()];
  }, [activeBroadcasts, selectedPartner]);

  useEffect(() => {
    if (availableDates.length && !selectedDate) {
      setSelectedDate(availableDates[availableDates.length - 1]);
    }
  }, [availableDates, selectedDate]);

  const entries = useMemo<Entry[]>(() => {
    if (!selectedDate) return [];
    const out: Entry[] = [];

    activeBroadcasts.forEach((b) => {
      const day = b.result.find((d) => d.date === selectedDate);
      if (!day) return;

      day.partners.forEach((p) => {
        if (selectedPartner !== "All" && p.partner !== selectedPartner) return;

        p.products.forEach((prod) => {
          if (selectedProduct !== "All" && prod.product !== selectedProduct)
            return;

          prod.copies.forEach((copy) => {
            out.push({
              date: selectedDate,
              broadcast: b.name,
              partner: p.partner,
              product: prod.product,
              copy: copy.copy,
              sends: copy.sends,
            });
          });
        });
      });
    });

    return out;
  }, [activeBroadcasts, selectedDate, selectedPartner, selectedProduct]);

  const showTeamColumns = selectedBroadcast === "All";

  const teamList = useMemo<string[]>(
    () =>
      showTeamColumns
        ? Array.from(new Set(entries.map((e) => e.broadcast))).sort()
        : [],
    [entries, showTeamColumns]
  );

  const teamFieldMap = useMemo<Record<string, TeamKey>>(() => {
    const sanitize = (name: string): TeamKey =>
      ("t_" + name.toLowerCase().replace(/[^a-z0-9]+/gi, "_")) as TeamKey;
    const map: Record<string, TeamKey> = {};
    teamList.forEach((n) => (map[n] = sanitize(n)));
    return map;
  }, [teamList]);

  const fmtNumber = (v: number | null | undefined) =>
    typeof v === "number" ? v.toLocaleString() : "";

  const { tableRows, tableColumns, overview } = useMemo(() => {
    const byCopy = new Map<string, CopyRow>();

    entries.forEach((e) => {
      if (!byCopy.has(e.copy)) {
        const base: CopyRow = { id: e.copy, copy: e.copy, total: 0 } as CopyRow;
        if (showTeamColumns) {
          teamList.forEach((name) => {
            base[teamFieldMap[name]] = 0;
          });
        }
        byCopy.set(e.copy, base);
      }
      const row = byCopy.get(e.copy)!;
      if (showTeamColumns) {
        row[teamFieldMap[e.broadcast]] += e.sends;
      }
      row.total += e.sends;
    });

    const rows: CopyRow[] = Array.from(byCopy.values()).map((r, idx) => ({
      ...r,
      id: `${r.copy}__${idx}`,
    }));

    rows.sort((a, b) => b.total - a.total);

    const cols: GridColDef[] = [
      { field: "copy", headerName: "Copy", flex: 1.8, minWidth: 260 },
      {
        field: "total",
        headerName: "Total sends",
        type: "number",
        width: 140,
        headerAlign: "right",
        align: "right",
        valueFormatter: (value) => fmtNumber(value as number),
      },

      ...(showTeamColumns
        ? teamList.map<GridColDef>((name) => ({
            field: teamFieldMap[name],
            headerName: name,
            type: "number",
            width: 150,
            headerAlign: "right",
            align: "right",
            valueFormatter: (value) => fmtNumber((value as number) ?? 0),
          }))
        : []),
    ];

    const summary = {
      copies: rows.length,
      teams: teamList.length,
      totalSends: rows.reduce((sum, r) => sum + (r.total || 0), 0),
    };

    return { tableRows: rows, tableColumns: cols, overview: summary };
  }, [entries, showTeamColumns, teamList, teamFieldMap]);

  const partnerStatsRows = useMemo<PartnerRow[]>(() => {
    const map = new Map<
      string,
      { sends: number; products: Record<string, number> }
    >();

    activeBroadcasts.forEach((b) => {
      b.result.forEach((day) => {
        if (day.date !== selectedDate) return;

        day.partners.forEach((p) => {
          if (selectedPartner !== "All" && p.partner !== selectedPartner)
            return;

          const existing = map.get(p.partner) ?? { sends: 0, products: {} };
          existing.sends += p.sends;

          p.products.forEach((prod) => {
            if (selectedProduct !== "All" && prod.product !== selectedProduct)
              return;
            existing.products[prod.product] =
              (existing.products[prod.product] || 0) + prod.sends;
          });

          map.set(p.partner, existing);
        });
      });
    });

    return Array.from(map.entries()).map(([name, stat]) => {
      const topProducts = Object.entries(stat.products)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([prod, c]) => `${prod}: ${c}`)
        .join(", ");

      return {
        id: name,
        name,
        sends: stat.sends,
        productsSummary: topProducts,
      };
    });
  }, [activeBroadcasts, selectedDate, selectedPartner, selectedProduct]);

  const partnerColumns: GridColDef[] = useMemo(
    () => [
      { field: "name", headerName: "Partner", flex: 1, minWidth: 160 },
      {
        field: "sends",
        headerName: "Total sends",
        type: "number",
        width: 140,
        headerAlign: "right",
        align: "right",
        valueFormatter: (value) => fmtNumber(value as number),
      },
      {
        field: "productsSummary",
        headerName: "Top products",
        flex: 2,
        minWidth: 240,
      },
    ],
    []
  );

  const downloadCsv = (
    rows: any[],
    columns: { field: string; headerName: string }[],
    filename: string
  ) => {
    const headers = columns.map((c) => c.headerName);
    const fields = columns.map((c) => c.field);

    const esc = (val: unknown) => {
      if (val === null || val === undefined) return "";
      const s = String(val);
      if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
      return s;
    };

    const csv = [
      headers.join(","),
      ...rows.map((r) => fields.map((f) => esc((r as any)[f])).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const buildRawRows = (allDates: boolean): Entry[] => {
    const rows: Entry[] = [];

    activeBroadcasts.forEach((b) => {
      b.result.forEach((day) => {
        if (!allDates && selectedDate && day.date !== selectedDate) return;

        day.partners.forEach((p) => {
          if (selectedPartner !== "All" && p.partner !== selectedPartner)
            return;

          p.products.forEach((prod) => {
            if (selectedProduct !== "All" && prod.product !== selectedProduct)
              return;

            prod.copies.forEach((copy) => {
              rows.push({
                date: day.date,
                broadcast: b.name,
                partner: p.partner,
                product: prod.product,
                copy: copy.copy,
                sends: copy.sends,
              });
            });
          });
        });
      });
    });

    return rows;
  };

  const exportRawCsvCurrentDate = () => {
    const rows = buildRawRows(false);
    downloadCsv(
      rows,
      [
        { field: "date", headerName: "Date" },
        { field: "broadcast", headerName: "Broadcast" },
        { field: "partner", headerName: "Partner" },
        { field: "product", headerName: "Product" },
        { field: "copy", headerName: "Copy" },
        { field: "sends", headerName: "Sends" },
      ],
      `sends_raw_${selectedDate || "all"}.csv`
    );
  };

  const exportRawCsvAllDates = () => {
    const rows = buildRawRows(true);
    downloadCsv(
      rows,
      [
        { field: "date", headerName: "Date" },
        { field: "broadcast", headerName: "Broadcast" },
        { field: "partner", headerName: "Partner" },
        { field: "product", headerName: "Product" },
        { field: "copy", headerName: "Copy" },
        { field: "sends", headerName: "Sends" },
      ],
      `sends_raw_ALL_DATES.csv`
    );
  };

  const exportRawJsonAllDates = () => {
    const rows = buildRawRows(true);
    const blob = new Blob([JSON.stringify(rows, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "sends_raw_ALL_DATES.json");
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  
  const resetFilters = () => {
    setSelectedBroadcast("All");
    setSelectedPartner("All");
    setSelectedProduct("All");
    setSelectedDate(null); 
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ p: 0 }}>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Typography variant="h5">Broadcast Stats</Typography>

              <Stack direction="row" spacing={1}>
                <Tooltip title="Change dates">
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EventIcon />}
                    onClick={onRequestChangeDates}
                  >
                    Change dates
                  </Button>
                </Tooltip>
                <Tooltip title="Reset filters">
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<RestartAltIcon />}
                    onClick={resetFilters}
                  >
                    Reset filters
                  </Button>
                </Tooltip>
                <Tooltip title="Exsport raw current date CSV">
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={exportRawCsvCurrentDate}
                  >
                    Raw CSV (date)
                  </Button>
                </Tooltip>
                <Tooltip title="Exsport raw all dates CSV">
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={exportRawCsvAllDates}
                  >
                    Raw CSV (all)
                  </Button>
                </Tooltip>
                <Tooltip title="Exsport raw all dates JSON">
                  <Button
                    size="small"
                    variant="text"
                    onClick={exportRawJsonAllDates}
                  >
                    JSON (all)
                  </Button>
                </Tooltip>
              </Stack>
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 2,
                mb: 2,
              }}
            >
              <Autocomplete
                options={["All", ...broadcasts.map((b) => b.name)]}
                value={selectedBroadcast}
                onChange={(_, v) => setSelectedBroadcast(v ?? "All")} 
                clearOnEscape
                renderInput={(params) => (
                  <TextField {...params} label="Broadcast" />
                )}
              />
              <Autocomplete
                options={allPartners}
                value={selectedPartner}
                onChange={(_, v) => {
                  setSelectedPartner(v ?? "All");
                  setSelectedProduct("All");
                }}
                clearOnEscape
                renderInput={(params) => (
                  <TextField {...params} label="Partner" />
                )}
              />
              <Autocomplete
                options={allProducts}
                value={selectedProduct}
                onChange={(_, v) => setSelectedProduct(v ?? "All")}
                clearOnEscape
                renderInput={(params) => (
                  <TextField {...params} label="Product" />
                )}
              />
              <Autocomplete
                options={availableDates}
                value={selectedDate}
                onChange={(_, v) => setSelectedDate(v)} 
                clearOnEscape
                renderInput={(params) => <TextField {...params} label="Date" />}
              />
            </Box>

            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              <Chip label={`Copies: ${overview.copies}`} />
              {showTeamColumns && <Chip label={`Teams: ${overview.teams}`} />}
              <Chip
                label={`Total sends: ${overview.totalSends.toLocaleString()}`}
              />
            </Stack>

            <Box sx={{ width: "100%" }}>
              <DataGrid
                rows={tableRows}
                columns={tableColumns}
                autoHeight
                disableRowSelectionOnClick
                initialState={{
                  sorting: { sortModel: [{ field: "total", sort: "desc" }] },
                }}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 300 },
                    csvOptions: {
                      fileName: `broadcast_table_${selectedDate || "all"}`,
                    },
                  },
                }}
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    position: "sticky",
                    top: 0,
                    backgroundColor: "background.paper",
                    zIndex: 1,
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Partner Breakdown
            </Typography>
            <DataGrid
              rows={partnerStatsRows}
              columns={partnerColumns}
              autoHeight
              disableRowSelectionOnClick
              initialState={{
                sorting: { sortModel: [{ field: "sends", sort: "desc" }] },
              }}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 300 },
                  csvOptions: {
                    fileName: `partner_breakdown_${selectedDate || "all"}`,
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default BroadcastSendsAnalytics;
