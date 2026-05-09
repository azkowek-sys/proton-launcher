<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; script-src 'self' 'unsafe-inline';">
  <title>Proton Launcher</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
</head>
<body>
  <div id="app">

    <!-- Custom Titlebar -->
    <div id="titlebar">
      <div class="tb-drag">
        <div class="app-logo">
          <div class="app-icon-wrap">⚗️</div>
          <span class="app-name">Proton Launcher</span>
        </div>
      </div>
      <div class="wm-controls">
        <button class="wm-btn" id="btn-min" title="Minimize"><i class="ti ti-minus"></i></button>
        <button class="wm-btn" id="btn-max" title="Maximize"><i class="ti ti-square"></i></button>
        <button class="wm-btn wm-close" id="btn-close" title="Close"><i class="ti ti-x"></i></button>
      </div>
    </div>

    <!-- Toolbar -->
    <div id="toolbar">
      <button class="tool-btn primary" id="btn-add-instance">
        <i class="ti ti-plus"></i> Add Instance
      </button>
      <div class="tb-sep"></div>
      <button class="tool-btn" id="btn-launch" data-disabled="true">
        <i class="ti ti-player-play"></i> Launch
      </button>
      <button class="tool-btn" id="btn-edit" data-disabled="true">
        <i class="ti ti-pencil"></i> Edit
      </button>
      <button class="tool-btn" id="btn-kill" data-disabled="true">
        <i class="ti ti-player-stop"></i> Kill
      </button>
      <div class="tb-sep"></div>
      <button class="tool-btn" id="btn-folder" data-disabled="true">
        <i class="ti ti-folder-open"></i> Folder
      </button>
      <div class="spacer"></div>
      <div class="search-wrap">
        <i class="ti ti-search"></i>
        <input id="search-box" placeholder="Search instances…" autocomplete="off">
      </div>
      <div class="tb-sep"></div>
      <button class="tool-btn" id="btn-toggle-view" title="Toggle view">
        <i class="ti ti-layout-grid"></i>
      </button>
    </div>

    <!-- Body -->
    <div id="body">

      <!-- Sidebar -->
      <aside id="sidebar">
        <div class="sidebar-section">
          <div class="sidebar-label">Instances</div>
          <div class="nav-item active" data-filter="all">
            <i class="ti ti-apps"></i> All Instances
          </div>
          <div class="nav-item" data-filter="recent">
            <i class="ti ti-clock"></i> Recent
          </div>
          <div class="nav-item" data-filter="fav">
            <i class="ti ti-star"></i> Favourites
          </div>
        </div>
        <div class="sidebar-sep"></div>
        <div class="sidebar-section">
          <div class="sidebar-label">Groups</div>
          <div class="nav-item" data-filter="vanilla">
            <i class="ti ti-leaf"></i> Vanilla
          </div>
          <div class="nav-item" data-filter="modded">
            <i class="ti ti-tool"></i> Modded
            <span class="nav-badge">4</span>
          </div>
        </div>
        <div class="sidebar-sep"></div>
        <div class="sidebar-section">
          <div class="sidebar-label">Tools</div>
          <div class="nav-item" data-page="mods">
            <i class="ti ti-puzzle"></i> Mod Browser
          </div>
          <div class="nav-item" data-page="java">
            <i class="ti ti-coffee"></i> Java Versions
          </div>
          <div class="nav-item" data-page="settings">
            <i class="ti ti-settings"></i> Settings
          </div>
        </div>
        <div class="sidebar-spacer"></div>
        <div id="account-row">
          <div class="avatar" id="account-avatar">S</div>
          <div class="account-info">
            <div class="account-name" id="account-name">Steve</div>
            <div class="account-type" id="account-type">Not logged in</div>
          </div>
          <button class="icon-btn" id="btn-account" title="Manage accounts">
            <i class="ti ti-chevron-down"></i>
          </button>
        </div>
      </aside>

      <!-- Main -->
      <main id="main">

        <!-- Instances page -->
        <div id="page-instances" class="page active">
          <div class="section-header">
            <span class="section-title" id="instances-title">All Instances</span>
            <div style="display:flex;gap:8px;align-items:center;">
              <span class="section-count" id="instances-count"></span>
              <button class="link-btn">Manage groups</button>
            </div>
          </div>
          <div id="instance-grid"></div>

          <div class="section-header" style="margin-top:20px;">
            <span class="section-title">News</span>
            <button class="link-btn">View all</button>
          </div>
          <div id="news-list"></div>
        </div>

        <!-- Settings page -->
        <div id="page-settings" class="page">
          <div class="section-header">
            <span class="section-title">Settings</span>
          </div>
          <div class="settings-grid">
            <div class="settings-card">
              <div class="settings-card-title"><i class="ti ti-coffee"></i> Java</div>
              <div class="setting-row">
                <div class="setting-label">Default Java</div>
                <select class="mc-select">
                  <option>Java 21 (recommended)</option>
                  <option>Java 17</option>
                  <option>Java 8</option>
                </select>
              </div>
              <div class="setting-row">
                <div class="setting-label">Min RAM</div>
                <input type="range" min="512" max="8192" step="512" value="1024" class="mc-slider" oninput="document.getElementById('ram-min-val').textContent=this.value+'MB'">
                <span class="slider-val" id="ram-min-val">1024MB</span>
              </div>
              <div class="setting-row">
                <div class="setting-label">Max RAM</div>
                <input type="range" min="1024" max="16384" step="512" value="4096" class="mc-slider" oninput="document.getElementById('ram-max-val').textContent=this.value+'MB'">
                <span class="slider-val" id="ram-max-val">4096MB</span>
              </div>
            </div>
            <div class="settings-card">
              <div class="settings-card-title"><i class="ti ti-palette"></i> Appearance</div>
              <div class="setting-row">
                <div class="setting-label">Theme</div>
                <select class="mc-select">
                  <option>Dark (default)</option>
                  <option>Light</option>
                  <option>Midnight</option>
                </select>
              </div>
              <div class="setting-row">
                <div class="setting-label">Accent color</div>
                <div style="display:flex;gap:6px;">
                  <div class="color-swatch active" style="background:#7c6aee" data-color="#7c6aee"></div>
                  <div class="color-swatch" style="background:#4a9de0" data-color="#4a9de0"></div>
                  <div class="color-swatch" style="background:#4caf7d" data-color="#4caf7d"></div>
                  <div class="color-swatch" style="background:#e09d4a" data-color="#e09d4a"></div>
                  <div class="color-swatch" style="background:#e05c5c" data-color="#e05c5c"></div>
                </div>
              </div>
              <div class="setting-row">
                <div class="setting-label">Hide on launch</div>
                <label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label>
              </div>
            </div>
            <div class="settings-card">
              <div class="settings-card-title"><i class="ti ti-download"></i> Downloads</div>
              <div class="setting-row">
                <div class="setting-label">Concurrent downloads</div>
                <select class="mc-select">
                  <option>4 (default)</option>
                  <option>2</option>
                  <option>8</option>
                </select>
              </div>
              <div class="setting-row">
                <div class="setting-label">Verify assets</div>
                <label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label>
              </div>
            </div>
            <div class="settings-card">
              <div class="settings-card-title"><i class="ti ti-info-circle"></i> About</div>
              <div class="about-content">
                <div class="about-logo">⚗️</div>
                <div class="about-name">Proton Launcher</div>
                <div class="about-ver">v1.0.0</div>
                <div class="about-desc">A modern Minecraft launcher.</div>
                <button class="tool-btn" style="margin-top:10px;width:100%;justify-content:center;">
                  <i class="ti ti-refresh"></i> Check for updates
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mods page -->
        <div id="page-mods" class="page">
          <div class="section-header">
            <span class="section-title">Mod Browser</span>
          </div>
          <div class="placeholder-page">
            <i class="ti ti-puzzle" style="font-size:48px;color:var(--text3);"></i>
            <div style="color:var(--text2);font-size:14px;font-weight:500;">Mod Browser</div>
            <div style="color:var(--text3);font-size:12px;">Browse and install mods from Modrinth & CurseForge.<br>Select an instance first to browse compatible mods.</div>
          </div>
        </div>

        <!-- Java page -->
        <div id="page-java" class="page">
          <div class="section-header">
            <span class="section-title">Java Versions</span>
            <button class="tool-btn primary" style="font-size:11px;padding:5px 10px;"><i class="ti ti-plus"></i> Install Java</button>
          </div>
          <div id="java-list">
            <div class="java-row">
              <div class="java-icon"><i class="ti ti-coffee"></i></div>
              <div class="java-info">
                <div class="java-name">Java 21.0.3 <span class="java-tag recommended">Recommended</span></div>
                <div class="java-path">C:\Program Files\Eclipse Adoptium\jdk-21.0.3.9-hotspot\bin\javaw.exe</div>
              </div>
              <button class="tool-btn" style="font-size:10px;padding:4px 8px;">Test</button>
            </div>
            <div class="java-row">
              <div class="java-icon"><i class="ti ti-coffee"></i></div>
              <div class="java-info">
                <div class="java-name">Java 17.0.10</div>
                <div class="java-path">C:\Program Files\Eclipse Adoptium\jdk-17.0.10.7-hotspot\bin\javaw.exe</div>
              </div>
              <button class="tool-btn" style="font-size:10px;padding:4px 8px;">Test</button>
            </div>
            <div class="java-row">
              <div class="java-icon"><i class="ti ti-coffee"></i></div>
              <div class="java-info">
                <div class="java-name">Java 8u402</div>
                <div class="java-path">C:\Program Files\Eclipse Adoptium\jdk-8.0.402.6-hotspot\bin\javaw.exe</div>
              </div>
              <button class="tool-btn" style="font-size:10px;padding:4px 8px;">Test</button>
            </div>
          </div>
        </div>

      </main>
    </div>

    <!-- Status bar -->
    <div id="statusbar">
      <div class="status-item">
        <div class="status-dot green"></div> Ready
      </div>
      <div class="status-item"><i class="ti ti-coffee"></i> Java 21.0.3</div>
      <div class="status-item"><i class="ti ti-cpu"></i> 4 GB allocated</div>
      <div class="spacer"></div>
      <div class="status-item"><i class="ti ti-brand-github"></i> v1.0.0</div>
    </div>

    <!-- Context Menu -->
    <div id="ctx-menu">
      <div class="ctx-item" data-action="launch"><i class="ti ti-player-play"></i> Launch</div>
      <div class="ctx-item" data-action="edit"><i class="ti ti-pencil"></i> Edit instance</div>
      <div class="ctx-item" data-action="folder"><i class="ti ti-folder-open"></i> Open folder</div>
      <div class="ctx-item" data-action="copy"><i class="ti ti-copy"></i> Copy instance</div>
      <div class="ctx-sep"></div>
      <div class="ctx-item" data-action="fav"><i class="ti ti-star"></i> Add to favourites</div>
      <div class="ctx-sep"></div>
      <div class="ctx-item danger" data-action="delete"><i class="ti ti-trash"></i> Delete</div>
    </div>

    <!-- Modal backdrop -->
    <div id="modal-backdrop" class="hidden">
      <div id="modal">
        <div id="modal-header">
          <span id="modal-title">Add Instance</span>
          <button class="icon-btn" id="modal-close"><i class="ti ti-x"></i></button>
        </div>
        <div id="modal-body"></div>
        <div id="modal-footer">
          <button class="tool-btn" id="modal-cancel">Cancel</button>
          <button class="tool-btn primary" id="modal-ok">Create</button>
        </div>
      </div>
    </div>

  </div>

  <script src="renderer.js"></script>
</body>
</html>
