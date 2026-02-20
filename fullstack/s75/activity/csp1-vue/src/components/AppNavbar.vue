<template>
<nav class="navbar navbar-expand-lg navbar-dark fixed-top appNavbar">
      <div class="container">
        <!-- Required: trainee name element -->
        <a class="navbar-brand appBrand" href="#landing">JosoLi</a>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link appNavLink" href="#landing">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link appNavLink" href="#projects">My Projects</a>
            </li>
            <li class="nav-item">
              <a class="nav-link appNavLink" href="#tools">Tools</a>
            </li>
            <li class="nav-item">
              <a class="nav-link appNavLink" href="#contact">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
</template>
