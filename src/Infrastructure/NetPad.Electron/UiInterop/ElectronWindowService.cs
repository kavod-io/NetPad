using ElectronNET.API.Entities;
using Microsoft.Extensions.Logging;
using NetPad.Configuration;
using NetPad.Scripts;
using NetPad.UiInterop;

namespace NetPad.Electron.UiInterop;

public class ElectronWindowService : IUiWindowService
{
    private readonly WindowManager _windowManager;
    private readonly Settings _settings;
    private readonly ILogger<ElectronWindowService> _logger;

    public ElectronWindowService(WindowManager windowManager, Settings settings, ILogger<ElectronWindowService> logger)
    {
        _windowManager = windowManager;
        _settings = settings;
        _logger = logger;
    }

    private async Task<Display> PrimaryDisplay() => await ElectronNET.API.Electron.Screen.GetPrimaryDisplayAsync();

    public async Task OpenMainWindowAsync()
    {
        bool useNativeDecorations = _settings.Appearance.Titlebar.Type == TitlebarType.Native;

        var display = await PrimaryDisplay();
        var window = await _windowManager.CreateWindowAsync("main", true, new BrowserWindowOptions
        {
            Show = false,
            Height = display.Bounds.Height * 2 / 3,
            Width = display.Bounds.Width * 2 / 3,
            X = display.Bounds.X,
            Y = display.Bounds.Y,
            Frame = useNativeDecorations,
            AutoHideMenuBar = _settings.Appearance.Titlebar.MainMenuVisibility == MainMenuVisibility.AutoHidden,
            Fullscreenable = true,
        });

        window.Show();
        window.Maximize();
    }

    public async Task OpenSettingsWindowAsync(string? tab = null)
    {
        const string windowName = "settings";

        if (_windowManager.FocusExistingWindowIfOpen(windowName))
        {
            return;
        }

        var display = await PrimaryDisplay();

        var queryParams = new List<(string, object?)>();
        if (tab != null) queryParams.Add(("tab", tab));

        var window = await _windowManager.CreateWindowAsync(windowName, true, new BrowserWindowOptions
        {
            Title = "Settings",
            Height = display.Bounds.Height * 2 / 3,
            Width = display.Bounds.Width * 1 / 2,
            AutoHideMenuBar = true
        }, queryParams.ToArray());

        window.SetParentWindow(ElectronUtil.MainWindow);
        var mainWindowPosition = await ElectronUtil.MainWindow.GetPositionAsync();
        window.SetPosition(mainWindowPosition[0], mainWindowPosition[1]);
        window.Center();
    }

    public async Task OpenScriptConfigWindowAsync(Script script, string? tab = null)
    {
        const string windowName = "script-config";

        if (_windowManager.FocusExistingWindowIfOpen(windowName))
        {
            return;
        }

        var display = await PrimaryDisplay();

        var queryParams = new List<(string, object?)>();
        queryParams.Add(("script-id", script.Id));
        if (tab != null) queryParams.Add(("tab", tab));

        var window = await _windowManager.CreateWindowAsync(windowName, true, new BrowserWindowOptions
        {
            Title = script.Name,
            Height = display.Bounds.Height * 2 / 3,
            Width = display.Bounds.Width * 4 / 5,
            AutoHideMenuBar = true
        }, queryParams.ToArray());

        window.SetParentWindow(ElectronUtil.MainWindow);
        var mainWindowPosition = await ElectronUtil.MainWindow.GetPositionAsync();
        window.SetPosition(mainWindowPosition[0], mainWindowPosition[1]);
        window.Center();
    }

    public async Task OpenDataConnectionWindowAsync(Guid? dataConnectionId)
    {
        const string windowName = "data-connection";

        if (_windowManager.FocusExistingWindowIfOpen(windowName))
        {
            return;
        }

        var display = await PrimaryDisplay();

        var queryParams = new List<(string, object?)>();
        if (dataConnectionId != null) queryParams.Add(("data-connection-id", dataConnectionId));

        var window = await _windowManager.CreateWindowAsync(windowName, true, new BrowserWindowOptions
        {
            Title = (dataConnectionId.HasValue ? "Edit" : "New") + "Connection",
            Height = display.Bounds.Height * 4 / 10,
            Width = 750,
            AutoHideMenuBar = true,
            MinWidth = 550,
            MinHeight = 550
        }, queryParams.ToArray());

        window.SetParentWindow(ElectronUtil.MainWindow);
        var mainWindowPosition = await ElectronUtil.MainWindow.GetPositionAsync();
        window.SetPosition(mainWindowPosition[0], mainWindowPosition[1]);
        window.Center();
    }

    public async Task OpenOutputWindowAsync()
    {
        const string windowName = "output";

        if (_windowManager.FocusExistingWindowIfOpen(windowName))
        {
            return;
        }

        var display = await PrimaryDisplay();

        var window = await _windowManager.CreateWindowAsync(windowName, true, new BrowserWindowOptions
        {
            Title = "Output",
            Height = display.Bounds.Height * 2 / 3,
            Width = display.Bounds.Width * 4 / 5,
            AutoHideMenuBar = true,
            Show = false
        });

        var mainWindowPosition = await ElectronUtil.MainWindow.GetPositionAsync();
        window.SetPosition(mainWindowPosition[0], mainWindowPosition[1]);
        window.Center();
        window.Maximize();
        window.Show();
    }
}
