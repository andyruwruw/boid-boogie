<p align="center">
  <img src="https://raw.githubusercontent.com/andyruwruw/boid-boogie/master/documentation/logo.PNG">
</p>

# Overview

Boid boogie is a flocking simulation that uses [Spotify's API](https://developer.spotify.com/documentation/web-api/) and [Spotify's Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/) to match the animations to your current playback.

Largly inspired by [Kaleidosync](https://www.kaleidosync.com/visualizer) by Zachary Winter. If you like this, you'll love his application.

# How it works

### Flocking Simulation

Each point, or boid, has a limited perception by which it can see other boids.

It then adjusts its acceleration based on three steering behaviors. 

1. Separation: Push away from other boids.
2. Cohesion: Pull towards the average position of all nearby boids.
3. Alignment: Steer towards the average direction neighbors are traveling.

It's that easy!

### QuadTree

To make things a little easier to process, a quad tree was used to store and query boids for neighbors.

Allows you to push the number of boids much higher.

### Spotify Web Playback SDK

As learned from Kaleidosync, querying Spotify's API for user's current playback to account for seeking, pausing, switching tracks can quickly reach rate limits.

A great way to fix this, implemented in Kaleidosync 2 was to utilize Spotify's Web Playback SDK, essentially turning your site into a device by which user's can play from.

This provides instant access to playback changes.

### Spotify's API

Here are two great endpoints used for this project.

- [Get Audio Features for a Track](https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/)

- [Get Audio Analysis for a Track](https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-analysis/)


