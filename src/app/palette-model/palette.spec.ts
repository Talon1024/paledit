import { Palette } from './palette';
import * as base64 from 'base64-js';

describe('Palette', () => {
  it('should create an instance', () => {
    expect(new Palette()).toBeTruthy();
  });
  const palstr = 'AAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4O' +
  'Dw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEh' +
  'IiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0' +
  'NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dH' +
  'SEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQUVFRUlJSU1NTVFRUVVVVVlZWV1dXWFhYWVlZWlpa' +
  'W1tbXFxcXV1dXl5eX19fYGBgYWFhYmJiY2NjZGRkZWVlZmZmZ2dnaGhoaWlpampqa2trbGxsbW1t' +
  'bm5ub29vcHBwcXFxcnJyc3NzdHR0dXV1dnZ2d3d3eHh4eXl5enp6e3t7fHx8fX19fn5+f39/gICA' +
  'gYGBgoKCg4ODhISEhYWFhoaGh4eHiIiIiYmJioqKi4uLjIyMjY2Njo6Oj4+PkJCQkZGRkpKSk5OT' +
  'lJSUlZWVlpaWl5eXmJiYmZmZmpqam5ubnJycnZ2dnp6en5+foKCgoaGhoqKio6OjpKSkpaWlpqam' +
  'p6enqKioqampqqqqq6urrKysra2trq6ur6+vsLCwsbGxsrKys7OztLS0tbW1tra2t7e3uLi4ubm5' +
  'urq6u7u7vLy8vb29vr6+v7+/wMDAwcHBwsLCw8PDxMTExcXFxsbGx8fHyMjIycnJysrKy8vLzMzM' +
  'zc3Nzs7Oz8/P0NDQ0dHR0tLS09PT1NTU1dXV1tbW19fX2NjY2dnZ2tra29vb3Nzc3d3d3t7e39/f' +
  '4ODg4eHh4uLi4+Pj5OTk5eXl5ubm5+fn6Ojo6enp6urq6+vr7Ozs7e3t7u7u7+/v8PDw8fHx8vLy' +
  '8/Pz9PT09fX19vb29/f3+Pj4+fn5+vr6+/v7/Pz8/f39/v7+////';
  it('should create a palette from raw data', () => {
    const palData: Uint8Array = base64.toByteArray(palstr);
    expect(Palette.fromData(palData, 256)).toBeTruthy();
  });
  it('should get a colour at a specific index', () => {
    const palData: Uint8Array = base64.toByteArray(palstr);
    const palette = Palette.fromData(palData, 256);
    const palColour = palette.colourAt(162);
    expect(palColour.red).toBe(162);
    expect(palColour.green).toBe(162);
    expect(palColour.blue).toBe(162);
  });
});
