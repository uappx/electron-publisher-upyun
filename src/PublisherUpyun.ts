import fs from 'fs';
import {PublisherOptions, PublisherStatic,} from '@electron-forge/publisher-static';
import debug from 'debug';
import {PublisherUpyunConfig} from "./Config";
import upyun from "upyun";

const d = debug('electron-forge:publish:upyun');

type Artifact = {
  path: string;
  keyPrefix: string;
  platform: string;
  arch: string;
};

export default class PublisherUpyun extends PublisherStatic<PublisherUpyunConfig> {
  name = 'upyun';

  private filterKeySafe = (key: string) => {
    return key.replace(/@/g, '_').replace(/\//g, '_');
  };

  async publish({makeResults, setStatusLine}: PublisherOptions): Promise<void> {
    const artifacts: Artifact[] = [];

    if (!this.config.service || !this.config.operator || !this.config.password) {
      throw new Error('配置里缺少必要参数: service, operator, password');
    }

    for (const makeResult of makeResults) {
      artifacts.push(
        ...makeResult.artifacts.map((artifact) => ({
          path: artifact,
          keyPrefix: this.config.prefix || this.filterKeySafe(makeResult.packageJSON.name),
          platform: makeResult.platform,
          arch: makeResult.arch,
        }))
      );
    }

    const service = new upyun.Service(this.config.service, this.config.operator, this.config.password)
    const client = new upyun.Client(service);
    d('creating upyun client with options:', this.config);

    let uploaded = 0;
    const updateStatusLine = () => setStatusLine(`Uploading distributable (${uploaded}/${artifacts.length})`);

    updateStatusLine();
    await Promise.all(
      artifacts.map(async (artifact) => {
        d('uploading:', artifact.path);
        client.putFile(this.keyForArtifact(artifact), fs.createReadStream(artifact.path))
        uploaded += 1;
        updateStatusLine();
      })
    );
  }
}

export {PublisherUpyun};
