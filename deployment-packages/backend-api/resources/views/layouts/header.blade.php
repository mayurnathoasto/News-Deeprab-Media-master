<nav class="main-header navbar navbar-expand navbar-white navbar-light" role="navigation" aria-label="Main navigation">
    <style>
        /* Responsive: tablet and below */
        @media (max-width: 768px) {
            .main-header .nav-link {
                padding: 0.5rem 0.5rem !important;
                min-height: 44px;
                display: inline-flex;
                align-items: center;
            }

            .main-header .user-image {
                max-width: 28px;
                max-height: 28px;
            }

            .main-header .navbar-nav.user-menu-right {
                flex-wrap: nowrap;
            }

            .main-header .user-menu .dropdown-toggle {
                max-width: 140px;
            }

            .main-header .user-menu .user-greeting {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .main-header .scrollable-menu {
                max-height: 60vh;
                overflow-y: auto;
            }
        }

        /* Responsive: small phones */
        @media (max-width: 425px) {
            .main-header .nav-link {
                padding: 0.4rem 0.5rem !important;
            }

            .main-header .user-image {
                max-width: 24px;
                max-height: 24px;
            }

            .main-header .user-menu .dropdown-toggle {
                max-width: 120px;
            }

            .main-header .version-badge {
                padding: 4px 6px !important;
                font-size: 0.7rem;
            }

            /* .main-header .current_language {
                display: none !important;
            } */
        }

        /* Responsive: extra small */
        @media (max-width: 320px) {
            .main-header .nav-link {
                padding: 0.35rem 0.4rem !important;
            }

            .main-header .user-image {
                max-width: 20px;
                max-height: 20px;
            }

            .main-header .user-menu .dropdown-toggle .user-greeting {
                display: none;
            }

            .main-header .version-badge {
                display: none !important;
            }
        }
    </style>

    <!-- Left navbar links -->
    <ul class="navbar-nav align-items-center flex-nowrap">
        <li class="nav-item">
            <a class="nav-link" data-widget="pushmenu" href="javascript:void(0)" role="button" aria-label="Toggle menu">
                <i class="fas fa-bars text-dark" aria-hidden="true"></i>
            </a>
        </li>
        <li class="nav-item ml-2">
            <span class="badge version-badge"
                style="border-radius: 8px!important; padding: 8px; color: {{ $setting['primary_color'] }}; border: 1px solid {{ $setting['primary_color'] }}">{{ $setting['app_version'] }}</span>
        </li>
        @if (env('DEMO_MODE'))
            <li class="nav-item ml-2 demo-mode-badge">
                <span class="badge badge-danger" style="border-radius: 8px!important; padding: 8px">Demo mode</span>
            </li>
        @endif
    </ul>
    @php
        // $setting = getSetting();
    @endphp

    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto align-items-center flex-nowrap user-menu-right">
        <li class="nav-item dropdown user-menu">
            <div class="d-flex align-items-center flex-nowrap">
                <span class="current_language text-nowrap mr-2 d-md-inline">
                    {{ empty(session('language_name')) ? 'EN' : Str::upper(Str::limit(session('language_name'), 2, '')) }}
                </span>
                <div class="dropdown navbar_dropdown mr-2">
                    <a href="javascript:void(0)" class="nav-link dropdown-toggle text-white" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false" id="languageDropdownToggle">
                        <i class="fas fa-language text-white" aria-hidden="true"></i>
                    </a>
                    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right" id="languageDropdown"
                        aria-labelledby="languageDropdownToggle">
                        <div class="scrollable-menu">
                            @foreach (get_language(1) as $key => $language)
                                <a class="dropdown-item" href="{{ url('set-language') . '/' . $language->code }}">
                                    {{ $language->language }}
                                </a>
                            @endforeach
                        </div>
                    </div>
                </div>

                <div class="dropdown navbar_dropdown">
                    <a href="javascript:void(0)" class="nav-link dropdown-toggle text-white d-flex align-items-center"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        @if (Auth::user()->image)
                            <img src="{{ url(Storage::url(Auth::user()->image)) }}"
                                class="user-image img-circle elevation-2 mr-1" alt="{{ Auth::user()->username }}">
                        @endif
                        <span class="user-greeting">{{ __('Hi') }}, {{ Auth::user()->username }}</span>
                    </a>
                    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                        <a href="{{ route('edit-profile') }}" class="dropdown-item">
                            <em class="fas fa-user mr-2" aria-hidden="true"></em>
                            <span>{{ __('edit') . ' ' . __('profile') }}</span>
                        </a>
                        <div class="dropdown-divider" role="separator"></div>
                        <a href="{{ url('logout') }}" class="dropdown-item">
                            <em class="fas fa-power-off mr-2" aria-hidden="true"></em>
                            <span>{{ __('logout') }}</span>
                        </a>
                    </div>
                </div>
            </div>
        </li>
    </ul>
</nav>
<!-- /.navbar -->