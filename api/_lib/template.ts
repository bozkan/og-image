
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

function getCss(theme: string, fontSize: string) {
    let background = '#ecf0f1';
    let foreground = 'black';

    if (theme === 'dark') {
        background = 'black';
        foreground = 'white';
    }
    return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background: ${background};
        background-size: 100px 100px;
        padding-left: 50px;
        margin-right: 50px;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        height: 100vh;

    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 100px;
    }
    .spacer-m {
        margin: 50px;
    }
    .spacer-sm {
        margin: 20px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    .city {
        font-size: 80px;
        color: #535c68;
        font-family: 'Inter', sans-serif;
    }

    .description {
        font-size: 48px;
        font-family: 'Inter', sans-serif;
    }

    .status-div {
        font-size: 64px;
        font-family: 'Inter', sans-serif;
    }
    .status {
        color: #2ecc71;
        font-weight: bold;
    }
    .terms {
        color: #2f3640;
        font-weight: bold;
        font-size: 64px;
        font-family: 'Inter', sans-serif;
        padding-bottom: 50px;
    }
    .heading {
        font-family: 'Inter', sans-serif;
        font-weight: bold;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, description, city, status, terms} = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div>
            <div class="logo-wrapper">
                <img src="https://img.incubatorlist.com/cover_wide.png" height="240">
            </div>
            <div class="heading">${emojify(
                md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
            <div class="city">${sanitizeHtml(city)}</div>
            <div class="spacer-sm"></div>
            <div class="description">${sanitizeHtml(description)}</div>
            <div class="terms">${sanitizeHtml(terms)}</div>
            <div class="status-div">Deadline: <span class="status">${sanitizeHtml(status)}</span></div>
        </div>
    </body>
</html>`;
}