export interface SSMLSegment {
  text: string;
  pause?: number;
  emphasis?: 'strong' | 'moderate' | 'reduced' | 'none';
  pitch?: number;
  rate?: number;
  volume?: number;
  prosody?: {
    pitch?: string;
    rate?: string;
    volume?: string;
  };
}

export interface SSMLParseResult {
  segments: SSMLSegment[];
  plainText: string;
  hasSSML: boolean;
}

export function parseSSML(text: string): SSMLParseResult {
  const hasSSML = /<[^>]+>/.test(text);
  
  if (!hasSSML) {
    return {
      segments: [{ text }],
      plainText: text,
      hasSSML: false,
    };
  }

  const segments: SSMLSegment[] = [];
  let plainText = '';
  
  const ssmlPattern = /<(break|emphasis|prosody|pause)([^>]*)>([^<]*)<\/\1>|([^<]+)/gi;
  let match;

  while ((match = ssmlPattern.exec(text)) !== null) {
    const [fullMatch, tagName, attributes, tagContent, plainContent] = match;

    if (plainContent) {
      segments.push({ text: plainContent.trim() });
      plainText += plainContent;
    } else if (tagName && tagContent) {
      const segment: SSMLSegment = { text: tagContent.trim() };
      
      switch (tagName.toLowerCase()) {
        case 'break':
        case 'pause': {
          const timeMatch = attributes.match(/time=["']?(\d+(?:\.\d+)?)(ms|s)?["']?/);
          if (timeMatch) {
            const value = parseFloat(timeMatch[1]);
            const unit = timeMatch[2] || 'ms';
            segment.pause = unit === 's' ? value * 1000 : value;
          } else {
            const strengthMatch = attributes.match(/strength=["']?(x-weak|weak|medium|strong|x-strong)["']?/);
            if (strengthMatch) {
              const strengthMap = {
                'x-weak': 100,
                'weak': 250,
                'medium': 500,
                'strong': 750,
                'x-strong': 1000,
              };
              segment.pause = strengthMap[strengthMatch[1] as keyof typeof strengthMap];
            }
          }
          break;
        }
        
        case 'emphasis': {
          const levelMatch = attributes.match(/level=["']?(strong|moderate|reduced|none)["']?/);
          if (levelMatch) {
            segment.emphasis = levelMatch[1] as SSMLSegment['emphasis'];
          }
          break;
        }
        
        case 'prosody': {
          const prosody: SSMLSegment['prosody'] = {};
          
          const pitchMatch = attributes.match(/pitch=["']?([^"'\s>]+)["']?/);
          if (pitchMatch) {
            prosody.pitch = pitchMatch[1];
            segment.pitch = parseProsodyValue(pitchMatch[1], 1.0);
          }
          
          const rateMatch = attributes.match(/rate=["']?([^"'\s>]+)["']?/);
          if (rateMatch) {
            prosody.rate = rateMatch[1];
            segment.rate = parseProsodyValue(rateMatch[1], 1.0);
          }
          
          const volumeMatch = attributes.match(/volume=["']?([^"'\s>]+)["']?/);
          if (volumeMatch) {
            prosody.volume = volumeMatch[1];
            segment.volume = parseProsodyValue(volumeMatch[1], 1.0);
          }
          
          segment.prosody = prosody;
          break;
        }
      }
      
      segments.push(segment);
      plainText += tagContent;
    }
  }

  return {
    segments: segments.filter(s => s.text),
    plainText: plainText.trim(),
    hasSSML,
  };
}

function parseProsodyValue(value: string, defaultValue: number): number {
  if (value.includes('%')) {
    const percent = parseFloat(value);
    return percent / 100;
  }
  
  if (value.startsWith('+') || value.startsWith('-')) {
    const offset = parseFloat(value);
    return defaultValue + (offset / 100);
  }
  
  const namedValues: Record<string, number> = {
    'x-low': 0.5,
    'low': 0.75,
    'medium': 1.0,
    'default': 1.0,
    'high': 1.25,
    'x-high': 1.5,
    'x-slow': 0.5,
    'slow': 0.75,
    'fast': 1.25,
    'x-fast': 1.5,
    'silent': 0,
    'x-soft': 0.3,
    'soft': 0.6,
    'loud': 1.4,
    'x-loud': 1.7,
  };
  
  return namedValues[value.toLowerCase()] || defaultValue;
}

export function generateSSMLExample(type: 'pause' | 'emphasis' | 'pitch' | 'mixed'): string {
  switch (type) {
    case 'pause':
      return 'Hello everyone! <break time="500ms"/> Welcome to the stream! <break strength="strong"/> Let\'s get started!';
    
    case 'emphasis':
      return 'That was <emphasis level="strong">amazing</emphasis>! Great job team!';
    
    case 'pitch':
      return '<prosody pitch="high">This is so exciting!</prosody> <prosody pitch="low">But we need to stay focused.</prosody>';
    
    case 'mixed':
      return '<prosody pitch="high" rate="fast">Wow!</prosody> <break time="300ms"/> That was <emphasis level="strong">incredible</emphasis>! <break time="500ms"/> <prosody rate="slow">Let me show you how it\'s done.</prosody>';
    
    default:
      return 'Hello! This is a test message.';
  }
}

export function wrapWithSSML(text: string, options: {
  pause?: number | 'weak' | 'medium' | 'strong';
  emphasis?: 'strong' | 'moderate' | 'reduced';
  pitch?: 'low' | 'medium' | 'high' | string;
  rate?: 'slow' | 'medium' | 'fast' | string;
}): string {
  let wrapped = text;
  
  if (options.emphasis) {
    wrapped = `<emphasis level="${options.emphasis}">${wrapped}</emphasis>`;
  }
  
  if (options.pitch || options.rate) {
    const prosodyAttrs: string[] = [];
    if (options.pitch) prosodyAttrs.push(`pitch="${options.pitch}"`);
    if (options.rate) prosodyAttrs.push(`rate="${options.rate}"`);
    wrapped = `<prosody ${prosodyAttrs.join(' ')}>${wrapped}</prosody>`;
  }
  
  if (options.pause) {
    const pauseAttr = typeof options.pause === 'number' 
      ? `time="${options.pause}ms"` 
      : `strength="${options.pause}"`;
    wrapped = `${wrapped}<break ${pauseAttr}/>`;
  }
  
  return wrapped;
}
