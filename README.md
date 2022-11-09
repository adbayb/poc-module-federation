<br>
<div align="center">
    <h1>🧪 Micro frontends</h1>
    <strong>Micro-frontend architecture exploration</strong>
</div>
<br>
<br>

## 🤔 Motivation

This repository aims to experiment and document several techniques to implement micro-frontend architecture.

### But before... what's the micro-frontend architecture?

To quote [Martin Fowler blog](https://martinfowler.com/articles/micro-frontends.html):
> Micro-frontend architecture can be defined as **an architectural style** where **independently deliverable** frontend applications are **composed into a greater whole**

As such, micro frontend is not a new framework, a technique or even a "thing": it's the manifestation of the software distribution idea in the frontend world. It provides guiding principles to decompose a front-end monolith into smaller applications (micro applications) and enjoy the ability to split the organization the same way (Conway's law). Each micro application can be then **developed**, **tested** and **deployed independently**, while still appearing to customers as a single cohesive product.

### Principles

Four fundamentals should be kept in mind while building micro frontends:
- **Domain-centric**: micro frontends have clear boundaries and ownership modeled around business domains ([subdomains](https://thedomaindrivendesign.io/domains-and-subdomains/)) to enable...
- **Autonomy**: micro frontends enable teams to work independently reducing the communication overhead and the release cycle time. Independent development and deployment are at the heart of the micro-frontend architecture. To make it possible, micro frontends rely on loose coupling (minimize dependency with the outside) and isolation (do not impact the rest of the system (encapsulation and fault isolation))
- **Alignment**: micro frontends are orchestrated properly to form a consistent application whole at the end. In other words, the website should make sure that micro frontends are harmoniously composed
- **Measurement**: observability and monitoring are keys to understanding how a distributed architecture such as the micro-frontend one behaves in production. It's essential to understand when something goes wrong along the application composition and delivery chain so the root cause can be identified and corrected. It's also important to define and monitor a performance budget from the beginning to make sure that local autonomous decisions (eg. different UI framework usage) don't hurt the overall user experience at the end (see the next part "Microservice analogy")

### Microservice analogy

You might have heard the not-so-truth microservice analogy: "micro frontends are like microservices but in the front-end world".  While both allow complex system decomposition, there're some notable differences tied to the execution context. Indeed, by virtue of running within the browser, micro frontends result in different constraints. With this in mind, tech stack freedom level (eg. multi-framework usage) must be carefully assessed to not impact the user experience and performance at the end.

### When to use it?

Micro frontends are not a silver bullet and are definitively not suitable for all use cases.

There are some turning points: for example, a large organization with several teams working on the same code base where each team wants to work independently to deliver at their own pace. This example is one of the best fits for micro-frontend architecture.
In contrast, micro-frontend architecture is not suitable for small companies where the time commitment arising from the amount of work required makes the micro-frontend approach too much of an investment for the available resources.

It should be used with caution because, as we've seen, it can come with some challenges (performance, payload (bundle size), encapsulation, ...) that should be compared with benefits before deciding if it can a be good approach or not for a specific context.

<br>

## 🧪 Patterns

How the micro-frontend architecture could be applied? 
As usual, it'll depend heavily on the operational context but we will try to describe several recipes to follow including (at least but not only) identification, and composition challenges:

### Identification

Micro frontends divide the application into slices: each slice is modeled around subdomains, built from end-to-end (ie. spans from the data layer (infrastructure/backend) to the presentation one (frontend)), and run by a dedicated team.
This step, also known as slicing or splitting, allows to identify micro frontends by spotting slices in an existing or future product experience.  
Micro frontends can be defined in two ways: 
- **Vertical slice**: an entire view (or page). Each view is assigned to a team.  
- **Horizontal slice**: small fragment within an entire view (eg. a header, search, listing component, ...). Each fragment can be owned by a different team, and multiple teams are taking care of the view composition coordinating themselves for the final result presented to the end user.

In general, defining micro-frontends with a vertical slicing strategy will simplify many technical challenges to tackle because it's closest to the traditional SPA (Single-Page Application) approach. Indeed: 
- Owning a vertical slice of the application and not multiple parts spread across the application is closer to the way a team is used to working. Many existing techniques can be applied to this approach easing, also, the cross-team coordination (less dependency sharing, less communication overload, less QA complexity, ...).
- It'll enable natural encapsulation (ie. no side effects between micro frontends): eg. no host scope pollution, no logic/style leaking challenges...

Whatever the used approach, the important point is to **identify, first, each subdomain boundaries (bounded context)** to know how to slice an application and isolate micro frontends.

### Composition

Once each micro-frontend boundaries have been defined, the next challenge is to compose them together. There's a natural architecture that arises across all composition approaches: usually, there is a container application (shell) that renders common page elements, addresses cross-cutting concerns, and brings many micro frontends together on a page while informing the micro frontend where and when to render itself. 

Let's take a look at different micro frontend architecture composition techniques that can be used:

- [Build-time (or compile-time) composition](./buildtime): It consists of publishing each micro frontend as a package, and having the shell includes them all as library dependencies. It produces a single deployable Javascript bundle, as is usual, allowing us to de-duplicate common dependencies from our various applications. However, this approach means that we have to re-compile and release every single micro frontend in order to release a change to any individual part of the product. Just as with microservices, we've seen enough pain caused by such a lockstep release process that we would recommend strongly against this kind of approach to micro frontends. We should find a way to integrate our micro frontends at runtime, rather than at build-time.
- [Client-side (or run-time) composition](./runtime): Integrates micro frontends at runtime (ie. composing micro applications together in the browser). For this, several techniques could be used to implement it such as [iframes](https://martinfowler.com/articles/micro-frontends.html#Run-timeIntegrationViaIframes), [functions](https://martinfowler.com/articles/micro-frontends.html#Run-timeIntegrationViaJavascript), or [web component interfaces](https://martinfowler.com/articles/micro-frontends.html#Run-timeIntegrationViaWebComponents).
- [Server-side composition](./serverside): In contrast to runtime like composition techniques, server side composition allows to assemble the markup of different micro frontends in the served page server side. It allows to achieve incredibly good first-page load speeds that are hard to match using pure client-side integration techniques and can be a requirement for applications with SEO constraints (crawling, indexing...). Please note, that this ingration is not mutually exclusive with runtime ones: server side rendering generally needs a rehydration step client side to attach event listeners and rebuilding the component tree. In this case, a runtime integration should be done as well client side to reconcialiate server rendered fragment during client hydration.

*TODO:*
- Linked application (MPA?)
- Unified SPA
- Pros/cons for each one

<br>

## 📖 Appendix

### Folder structure

For each experimentation, following folders can be found:

- Shell: The shell (or [container/host](https://webpack.js.org/concepts/module-federation/#low-level-concepts)) is the root application orchestrator. It is the main entrypoint scaffolding the application skeleton and allows bootstraping the whole application (eg. registering applications, sharing core libraries...).
- Modules: Micro frontends (also [remote module](https://webpack.js.org/concepts/module-federation/#low-level-concepts)) consumed by the shell. It can have its own client-side routing and framework/libraries but can also share them with the shell/other modules.
- Shared: Libraries shared across shell and modules. They're key to enable cross-application communication and data management (eg. store, event management...).

<br>

## 📕 Resources

### General
- [Introduction (1/3)](https://martinfowler.com/articles/micro-frontends.html)
- [Introduction (2/3)](https://micro-frontends.org/)
- [Introduction (3/3)](https://increment.com/frontend/micro-frontends-in-context/)
- [Identification recipes](https://lucamezzalira.com/2019/05/21/identifying-micro-frontends-in-our-applications/)
- [Architectural patterns](https://dev.to/okmttdhr/micro-frontends-architecture-patterns-introduction-3cpk)
- [Anti-patterns](https://www.youtube.com/watch?v=T3NINYCP9gg)

### Tools & frameworks
- [Module federation (or how to share dependencies and modules in an efficient way)](https://module-federation.github.io/)
- [Single-spa (or how to orchestrate micro frontends)](https://single-spa.js.org/)

### Others
- [Micro-frontend blog posts from Luca Mezzalira](https://lucamezzalira.com/tag/micro-frontends/)
- [Micro-frontends and the socio-technical aspect](https://techleadjournal.dev/episodes/47/)
- [A look at the micro-frontend architecture trend](https://frontendmastery.com/posts/understanding-micro-frontends/)
- [10 decision points for a micro-frontend approach](https://betterprogramming.pub/10-decision-points-for-micro-frontends-approach-4ebb4b59f40)
- [Micro Frontend Architecture: The newest approach To building scalable frontend](https://www.simform.com/blog/micro-frontend-architecture/)
