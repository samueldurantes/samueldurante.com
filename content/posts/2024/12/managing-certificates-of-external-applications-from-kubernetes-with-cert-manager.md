---
title: Managing certificates of external applications from Kubernetes with cert-manager
date: '2024-12-24'
---

Nowadays, SSL/TLS certificates are a crucial step in guaranteeing the safety of your online presence. Thanks to tools like [Kubernetes](https://kubernetes.io/) and [cert-manager](https://cert-manager.io/), it has never been so easy to manage certificates for free and automatically. In this post, we'll explore how to use this structure for applications outside of the Kubernetes cluster.

## Assumptions

This blog post assumes you have the following:

- Kubernetes cluster.
- cert-manager with some Issuer configured.

## 1. Create a Kubernetes Service

The first step is to expose the external application into the Kubernetes cluster, for this, we can create a [Service without Deployment](https://kubernetes.io/docs/concepts/services-networking/service/#services-without-selectors/) that we’ll link to [EndpointSlice](https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/) that redirects to this external application. We can create this Service by applying this manifest in your cluster:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: external-service
  namespace: default
spec:
  ports:
    - protocol: TCP
      port: 80
```

## 2. Create a Kubernetes EndpointSlice

The next step is to create an EndpointSlice (legacy Endpoints) because the [Service](https://kubernetes.io/docs/concepts/services-networking/service/) created in the previous step doesn't have a selector i.e. Endpoints aren't created automatically.
Again, we can create this EndpointSlice by applying this manifest in your cluster:

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: external-service-1
  namespace: default
  labels:
    kubernetes.io/service-name: external-service
addressType: IPv4
ports:
  - name: http
    appProtocol: http
    protocol: TCP
    port: 8080
endpoints:
  - addresses:
      # This is the internal IP of the VM where the application is running.
      - '10.260.65.801'
```

## 3. Exposing the Service on the network

Now, it's missing only we expose to this Service on the network. For this, I particularly like using the [NGINX Ingress controller](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/) to manage internet service exposure. Therefore, you can use any Ingress controller, as long as it has the [cert-manager annotation](https://cert-manager.io/docs/usage/ingress/#supported-annotations/) configured.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress
  namespace: default
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: 'letsencrypt-prod'
    nginx.ingress.kubernetes.io/ssl-redirect: 'true'
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - 'external.YOUR-DOMAIN.com'
      secretName: 'ingress-tls'
  rules:
    - host: external.YOUR-DOMAIN.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: external-service
                port:
                  number: 80
```

## 4. Verify connectivity

After applying and setting up this subdomain on your DNS service, you can finally test by making a HTTP call using [cURL](https://curl.se/).

```sh
$ curl https://external.YOUR-DOMAIN.com
```

## Conclusion

Sometimes, we need to run applications outside the Kubernetes cluster, whether due to specific infrastructure requirements or legacy systems. Even in these cases, this approach allows us to maintain centralized certificate management and robust security, ensuring consistency and reliability across all applications.

## Resources

- [Forwarding Kubernetes Services to External IPs Using Endpoints](https://ishu-harsh.medium.com/forwarding-kubernetes-services-to-external-ips-using-endpoints-497d40250b4b)
