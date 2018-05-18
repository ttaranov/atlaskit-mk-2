const boltWebpackAnalyzer = require('bolt-webpack-analyzer');
const chalk = require('chalk');
const { Document } = require('adf-builder');
const axios = require('axios');

const analysisServerEndpoint = process.env.ANALYSIS_SERVER_ENDPOINT;
const strideEndpoint = process.env.STRIDE_ENDPOINT;
const strideAccessToken = process.env.BUNDLE_ANALYSIS_STRIDE_TOKEN;

async function main() {
  try {
    let results = await boltWebpackAnalyzer({
      cwd: process.cwd(),
      ignore: [
        'build/*',
        'packages/css-packs/*',
        'website',
        'packages/core/polyfills',
        'packages/elements/util-data-test',
      ],
    });

    let config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let res = await axios.post(
      `${analysisServerEndpoint}/bundle-analysis`,
      JSON.stringify(results),
      config,
    );

    let doc = new Document();
    doc
      .paragraph()
      .text('New atlaskit bundle analysis report is out! ')
      .link(
        `${analysisServerEndpoint}/bundle-analysis-report/${res.data.id}`,
        `${analysisServerEndpoint}/bundle-analysis-report/${res.data.id}`,
      );

    config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + strideAccessToken,
      },
    };

    await axios.post(strideEndpoint, JSON.stringify(doc), config);
  } catch (err) {
    console.error(chalk.red(err));
    process.exit(1);
  }
}

main();
