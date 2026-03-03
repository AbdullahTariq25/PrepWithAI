const fs = require('fs');
const path = require('path');
const target = path.join(
  'e:\\Abdullah React project + experimantol projects\\aiinterviewcoach',
  'src', 'app', '(dashboard)', 'interview', '[id]', 'page.tsx'
);
const stub = `"use client";
import { useState } from "react";
export default function InterviewSessionPage() { return null; }
`;
fs.writeFileSync(target, stub, 'utf8');
console.log('OK:', target);
