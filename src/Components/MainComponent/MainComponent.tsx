import React, { useState, useEffect } from 'react';
import { Text } from '@mantine/core';
import { cropData } from '../../Assets/data'; 
import TableComponent from '../TableComponent/TableComponent';
import classes from './MainComponent.module.css'

interface CropData {
  Country: string;
  Year: string;
  "Crop Name": string;
  "Crop Production (UOM:t(Tonnes))": string | number;
  "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": string | number;
  "Area Under Cultivation (UOM:Ha(Hectares))": string | number;
}

interface ProcessedData {
  Year: string;
  MaxProductionCrop: string;
  MinProductionCrop: string;
}

interface AverageData {
  CropName: string;
  AverageYield: number;
  AverageArea: number;
}

const MainComponent: React.FC = () => {
  const [maxMinData, setMaxMinData] = useState<ProcessedData[]>([]);
  const [averageData, setAverageData] = useState<AverageData[]>([]);

  useEffect(() => {
    const processedMaxMinData = processMaxMinCropData(cropData);
    setMaxMinData(processedMaxMinData);

    const processedAverageData = processAverageData(cropData);
    setAverageData(processedAverageData);
  }, []);

  const processMaxMinCropData = (cropData: CropData[]): ProcessedData[] => {
    const yearMap = new Map<string, CropData[]>();

    cropData.forEach((crop) => {
      const production = crop["Crop Production (UOM:t(Tonnes))"] || "0";
      const productionValue = Number(production);
      const cleanedYear = crop.Year.replace("Financial Year (Apr - Mar), ", "");

      if (!isNaN(productionValue)) {
        if (!yearMap.has(cleanedYear)) {
          yearMap.set(cleanedYear, []);
        }
        yearMap.get(cleanedYear)!.push({ ...crop, "Crop Production (UOM:t(Tonnes))": productionValue });
      }
    });

    const processedData: ProcessedData[] = [];
    yearMap.forEach((crops, year) => {
      const maxCrop = crops.reduce((prev, curr) =>
        Number(curr["Crop Production (UOM:t(Tonnes))"]) > Number(prev["Crop Production (UOM:t(Tonnes))"]) ? curr : prev
      );
      const minCrop = crops.reduce((prev, curr) =>
        Number(curr["Crop Production (UOM:t(Tonnes))"]) < Number(prev["Crop Production (UOM:t(Tonnes))"]) ? curr : prev
      );

      processedData.push({
        Year: year,
        MaxProductionCrop: maxCrop["Crop Name"],
        MinProductionCrop: minCrop["Crop Name"],
      });
    });

    return processedData;
  };

  const processAverageData = (cropData: CropData[]): AverageData[] => {
    const cropMap = new Map<string, { totalYield: number; totalArea: number; count: number }>();

    cropData.forEach((crop) => {
      const year = Number(crop.Year.replace("Financial Year (Apr - Mar), ", ""));
      if (year >= 1950 && year <= 2020) {
        const yieldValue = Number(crop["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"]) || 0;
        const areaValue = Number(crop["Area Under Cultivation (UOM:Ha(Hectares))"]) || 0;

        if (!cropMap.has(crop["Crop Name"])) {
          cropMap.set(crop["Crop Name"], { totalYield: 0, totalArea: 0, count: 0 });
        }

        const cropStats = cropMap.get(crop["Crop Name"])!;
        cropStats.totalYield += yieldValue;
        cropStats.totalArea += areaValue;
        cropStats.count += 1;
      }
    });

    const processedAverageData: AverageData[] = [];
    cropMap.forEach((stats, cropName) => {
      const averageYield = stats.totalYield / stats.count;
      const averageArea = stats.totalArea / stats.count;
      processedAverageData.push({
        CropName: cropName,
        AverageYield: averageYield,
        AverageArea: averageArea,
      });
    });

    return processedAverageData;
  };

  if (!maxMinData.length || !averageData.length) {
    return <Text>No data available</Text>;
  }

  const maxMinColumns = [
    { title: 'Year', accessor: 'Year' },
    { title: 'Crop with Maximum Production', accessor: 'MaxProductionCrop' },
    { title: 'Crop with Minimum Production', accessor: 'MinProductionCrop' },
  ];

  const averageColumns = [
    { title: 'Crop Name', accessor: 'CropName' },
    { title: 'Average Yield (Kg/Ha)', accessor: 'AverageYield' },
    { title: 'Average Cultivation Area (Ha)', accessor: 'AverageArea' },
  ];

  return (
    <div className={classes.container}>
      <div>
        <h2>Table:1</h2>
        <TableComponent columns={maxMinColumns} data={maxMinData} />
      </div>
      <div>
        <h2>Table:2</h2>
        <TableComponent columns={averageColumns} data={averageData} />
      </div>
    </div>
  );
};

export default MainComponent;
