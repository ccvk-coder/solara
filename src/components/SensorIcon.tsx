import React from 'react';
import {
  CloudRainIcon,
  DropletIcon,
  DropletsIcon,
  FlaskConicalIcon,
  LeafIcon,
  SproutIcon,
  SunIcon,
  ThermometerIcon,
  WheatIcon } from
'lucide-react';
import type { SensorIconName } from '../types/dashboard';

interface SensorIconProps {
  name: SensorIconName;
  size?: number;
}

const ICONS = {
  droplet: DropletIcon,
  thermometer: ThermometerIcon,
  sun: SunIcon,
  rain: CloudRainIcon,
  droplets: DropletsIcon,
  flask: FlaskConicalIcon,
  leaf: LeafIcon,
  sprout: SproutIcon,
  wheat: WheatIcon
};

export function SensorIcon({ name, size = 18 }: SensorIconProps) {
  const Icon = ICONS[name];
  return <Icon size={size} strokeWidth={2.2} aria-hidden="true" />;
}