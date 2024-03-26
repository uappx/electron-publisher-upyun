interface Options {
  domain: string;
  protocol?: string; // http|https
  proxy?: string;
}

export interface PublisherUpyunConfig {
  service: string;
  operator: string;
  password: string;

  // 云存储路径的前缀
  prefix?: string;

  // 可选附加配置
  options?: Options;

  // 自定义更新路径规则
  keyResolver?: (fileName: string, platform: string, arch: string) => string;
}
