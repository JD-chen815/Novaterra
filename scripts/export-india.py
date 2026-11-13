#!/usr/bin/env python3
"""Export India through the installed Little Worlds exporter and shared country shell."""
from pathlib import Path
import argparse,importlib.util,tempfile,shutil
ROOT=Path(__file__).resolve().parent.parent
p=argparse.ArgumentParser();p.add_argument('--output',type=Path,default=ROOT/'work/india-standalone.html');p.add_argument('--exporter',type=Path,default=Path('/Users/vance/.codex/skills/little-worlds-3d/assets/starter/scripts/export-html.py'));a=p.parse_args()
spec=importlib.util.spec_from_file_location('little_worlds_export',a.exporter);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
with tempfile.TemporaryDirectory(prefix='india-export-') as d:
 project=Path(d).resolve();shutil.copytree(ROOT/'dist/assets/india-worlds',project,dirs_exist_ok=True)
 html=(ROOT/'dist/india.html').read_text()
 for css in ['world-shell.css','country-ui.css','assets/india-worlds/font.css']:
  html=html.replace(f'<link rel="stylesheet" href="{css}">','<style>'+(ROOT/'dist'/css).read_text()+'</style>')
 html=html.replace('href="assets/india-worlds/styles.css"','href="./styles.css"').replace('src="assets/india-worlds/src/main.js"','src="./src/main.js"')
 html=html.replace('<script type="module" src="world-shell.js"></script>','<script type="module">'+(ROOT/'dist/world-shell.js').read_text()+'</script>')
 html=html.replace('href="index.html#destinations"','href="https://little-elsewhere-vance.chenvance.chatgpt.site/index.html#destinations"')
 html=html.replace('</head>','<!-- Embedded Noto Sans Devanagari: '+(project/'OFL.txt').read_text().replace('--','- -')+' -->\n</head>')
 (project/'index.html').write_text(html);shutil.copyfile(project/'vendor/three/LICENSE.txt',project/'vendor/three/LICENSE')
 count,size=m.export(project,a.output.resolve());print(f'Exported India: {count} modules, {size:,} bytes: {a.output.resolve()}')
