---
layout: post
title: "Dns Service Discovery"
date: "2016-12-20 20:00:00 +0900"
tags: AdventCalendar DNS Docker
---

この記事は[dodosoft Advent Calendar 2016](http://www.adventar.org/calendars/1737) 20日目。

今回はインフラ周りの内容、DNS Service Discoveryを使ってEtcd Clusterを構築した話にします。

# Why?
最近Docker周りにハマっていたのですが、自分が仕事でやってるようなEnterpriseな環境で
使い物にするためには、Cluster等の構築が必須になります。なので、まず初めにDocker Swarmや
Kuberunetesを使える環境を作るわけですが、そのためのEtcdの設定をする必要があります。
ただ、2,3台のベアメタルサーバ程度の設定なら１台づつ設定ファイルを書いていけば問題ないのですが、
数十台とかのレベルになるととてもそんな面倒なことはできません。

なので、OSのインストールからEtcdの設定までをできる限り自動化することを目指しました。

# Let's configure Etcd cluster!
## Etcd
[Etcd](https://coreos.com/etcd/)とは[CoreOS](https://coreos.com)社が開発している、
オープンソースの分散Key-Value Storeです。Docker SwarmやKuberunetesのクラスタではこの
Etcdを使って設定項目を共有しています。

このEtcdでClusterを構築するために、Clusterのメンバーを取得する必要があるのですが、その
Discovery方法には3つの方法があります。

* Static
* etcd Discovery
* DNS Discovery

詳細に関しては[コチラ](https://coreos.com/etcd/docs/latest/op-guide/clustering.html)を参考に
してください。

今回はこの中でDNS Discoveryを利用します。DNS DiscoveryはDNSの[Service Record](http://www.ietf.org/rfc/rfc2052.txt)
(SRV Record)という仕組みを使ってClusterメンバーのDiscoveryを行います。

## DNS Service Record
DNS Service RecordはDomain Nameに対して、`_<ServiceName>._<tcp or udp>.domain`というレコードを
追加でき、そのドメインのサーバがどんなサービスをどのポート番号で提供しているかを表せるものです。

```
_http._tcp.example.jp.   IN  SRV 1   0   80  server01.example.jp.
_http._tcp.example.jp.   IN  SRV 2   0   80  server02.example.jp.

server01.example.jp.    IN  A   192.168.20.31
server02.example.jp.    IN  A   192.168.20.32
```

上のサンプルでは、`server01.example.jp`及び`server02.example.jp`が`80`番ポートで
HTTPサービスを提供していることを表しています。Etcdは、`--discovery-srv`で指定したZoneから
`_etcd-server._tcp`で指定されたホストを検索し、そのホスト間でClusterを構築します。

```
_etcd-server._tcp.example.com. 300 IN  SRV  0 0 2380 host01.example.com.
_etcd-server._tcp.example.com. 300 IN  SRV  0 0 2380 host02.example.com.
_etcd-server._tcp.example.com. 300 IN  SRV  0 0 2380 host03.example.com.
```

このように、DNSサーバに対してRecordを追加していき、各サーバに対してはCloud-initを使ってEtcd Serviceの登録、
 `--discovery-srv`オプションの追加をしてやることで、簡単にノードを増やすことができるようになりました。

 (相当ぶっ飛ばしましたが、Cloud-initでの設定方法などは[コチラ](http://www.projectatomic.io/blog/2015/06/creating-a-simple-bare-metal-atomic-host-cluster/)
 を参考にしてください。)

## DNS Update
ここまででもノード管理がかなり簡単になりましたが、ノードが増えるたびにレコードを追加していくことや、
ノードとIPアドレスの対応は手動で管理する必要がでてきます。

そこで、DHCPとDNSを連携させるDNS Updateの仕組みを使います。
DNS Updateは[RFC2136](https://tools.ietf.org/html/rfc2136)でも規定されている、動的にDNSの
Zoneファイルを変更させる仕組みです。

詳細については省きますが、DHCPと組み合わせることで、DHCP Lease 発行
にあわせてそのIPに対するFQDNをZoneファイルに自動で追加することができます。

これによって、さらにEtcdノードの管理が簡略化できました。


# Summary
かなり省略して書きましたが、ここまでやった感想としてDNS, DHCP周りはやれることってたくさんあるんだなと
感じました。ただ、これらの設定は結局設定ファイルの書き換えなので、Software Definedな世界にはまだまだ
だなという印象。
* 